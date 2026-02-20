import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storageService } from "@/services/storageService";
import { authService } from "@/services/authService";

/* =======================
   DEV SETTINGS
======================= */
const IS_DEBUG_MODE = __DEV__;
const AUTO_LOGIN_ADMIN = true;

const DEV_ADMIN_USERNAME = "admin";
const DEV_ADMIN_PASSWORD = "password";

/* =======================
   TYPES
======================= */
export type UserType =
    | "volunteer"
    | "association"
    | "admin"
    | "volunteer_guest";

export type AuthUser = {
  id_user: number;
  email: string;
  username: string;
  user_type: UserType;

  id_volunteer?: number;
  id_asso?: number;
  id_admin?: number;

  first_name?: string;
  last_name?: string;
  phone_number?: string;
  birthdate?: string;
  address?: string;
  zip_code?: string;
  bio?: string;
  skills?: string;

  name?: string;
  company_name?: string;
  rna_code?: string;
  country?: string;
};

type AuthContextType = {
  user: AuthUser | null;
  userType: UserType;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

/* =======================
   PROVIDER
======================= */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userType, setUserType] = useState<UserType>("volunteer_guest");
  const [isLoading, setIsLoading] = useState(true);

  /* =======================
     LOGOUT
  ======================= */
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await storageService.clear();
      await AsyncStorage.removeItem("cached_user");
      setUser(null);
      setUserType("volunteer_guest");
      console.log("✅ Logout OK");
    } catch (e) {
      console.error("Logout error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* =======================
     MAPPER API → AuthUser
  ======================= */
  const mapApiDataToUser = (data: any): AuthUser | null => {
    data = data?.data ?? data; // au cas où AxiosResponse

    if (!data) return null;

    // ✅ Cas A: ton backend renvoie { user_type, profile: {...} }
    if (data.user_type && data.profile) {
      const p = data.profile;
      return {
        id_user: p.id_user ?? p.id_admin ?? p.id_asso ?? p.id_volunteer ?? 0,
        email: p.email ?? "admin@example.com",
        username: p.username ?? "User",
        user_type: data.user_type as UserType,

        id_admin: p.id_admin,
        id_asso: p.id_asso,
        id_volunteer: p.id_volunteer,

        first_name: p.first_name,
        last_name: p.last_name,
        phone_number: p.phone_number,
        birthdate: p.birthdate,
        address: p.address,
        zip_code: p.zip_code,

        bio: p.bio,
        skills: p.skills,

        name: p.name,
        company_name: p.company_name,
        rna_code: p.rna_code,
        country: p.country,
      };
    }

    // ✅ Cas B: { user: {...}, ...profileFields }
    if (data.user) {
      return {
        id_user: data.user.id_user,
        email: data.user.email,
        username: data.user.username,
        user_type: data.user.user_type as UserType,

        id_volunteer: data.id_volunteer,
        id_asso: data.id_asso,
        id_admin: data.id_admin,

        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        birthdate: data.birthdate,
        address: data.address,
        zip_code: data.zip_code,
        bio: data.bio,
        skills: data.skills,

        name: data.name,
        company_name: data.company_name,
        rna_code: data.rna_code,
        country: data.country,
      };
    }

    // ✅ Cas C: utilisateur direct (sans "user")
    if (data.id_user && (data.user_type || data.mode)) {
      const resolvedType: UserType =
          data.user_type ?? (data.mode === "admin" ? "admin" : "volunteer_guest");

      return {
        id_user: data.id_user,
        email: data.email ?? "admin@example.com",
        username: data.username ?? "User",
        user_type: resolvedType,

        id_volunteer: data.id_volunteer,
        id_asso: data.id_asso,
        id_admin: data.id_admin,

        first_name: data.first_name,
        last_name: data.last_name,
        phone_number: data.phone_number,
        birthdate: data.birthdate,
        address: data.address,
        zip_code: data.zip_code,
        bio: data.bio,
        skills: data.skills,

        name: data.name,
        company_name: data.company_name,
        rna_code: data.rna_code,
        country: data.country,
      };
    }

    // ✅ Cas D: admin minimal
    if (data.id_admin || data.mode === "admin") {
      return {
        id_user: data.id_user ?? data.id_admin ?? 0,
        id_admin: data.id_admin ?? data.id_user ?? 0,
        email: data.email ?? "admin@example.com",
        username: data.username ?? "Admin",
        user_type: "admin",
      };
    }

    return null;
  };

  /* =======================
     FETCH PROFILE
  ======================= */
  const refetchUser = useCallback(async () => {
    try {
      setIsLoading(true);

      const token = await storageService.getAccessToken();
      console.log(
          "🔑 refetchUser token:",
          token ? token.slice(0, 20) + "..." : null
      );

      if (!token) {
        setUser(null);
        setUserType("volunteer_guest");
        return;
      }

      const raw = await authService.getMe();

// ✅ si getMe renvoie AxiosResponse, le vrai payload est dans raw.data
      const rawData = raw?.data ?? raw;

      console.log("🟡 getMe rawData keys =", Object.keys(rawData || {}));
      console.log("🟡 getMe rawData =", JSON.stringify(rawData, null, 2));

      const mappedUser = mapApiDataToUser(rawData);
      if (!mappedUser) throw new Error("Format de profil inconnu");

      setUser(mappedUser);
      setUserType(mappedUser.user_type);
      await storageService.setItem(
          "cached_user",
          JSON.stringify(mappedUser)
      );

      console.log(
          `✅ Profil OK: ${mappedUser.username} (${mappedUser.user_type})`
      );
    } catch (error: any) {
      console.error("❌ Refetch Error:", error);

      if (error.response?.status === 401) {
        await logout();
      } else {
        const cached = await AsyncStorage.getItem("cached_user");
        if (cached) {
          const u = JSON.parse(cached);
          setUser(u);
          setUserType(u.user_type);
          console.log("⚠️ Profil chargé depuis le cache");
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  /* =======================
     LOGIN
  ======================= */
  const login = useCallback(
      async (username: string, password: string) => {
        setIsLoading(true);
        try {
          await authService.login(username, password);
          await refetchUser();
        } catch (e) {
          console.error("Login failed", e);
          setIsLoading(false);
          throw e;
        }
      },
      [refetchUser]
  );

  /* =======================
     INIT (AUTO LOGIN DEV)
  ======================= */
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const existingToken = await storageService.getAccessToken();
        console.log(
            "🟣 INIT token:",
            existingToken ? existingToken.slice(0, 20) + "..." : null
        );

        if (!existingToken && IS_DEBUG_MODE && AUTO_LOGIN_ADMIN) {
          console.log("🟣 DEV auto-login admin...");
          await authService.login(
              DEV_ADMIN_USERNAME,
              DEV_ADMIN_PASSWORD
          );

          const newToken = await storageService.getAccessToken();
          console.log(
              "✅ DEV token:",
              newToken ? newToken.slice(0, 20) + "..." : null
          );
        }

        await refetchUser();
      } catch (e) {
        console.error("❌ Init auth failed:", e);
        setUser(null);
        setUserType("volunteer_guest");
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, [refetchUser]);

  /* =======================
     PROVIDER
  ======================= */
  return (
      <AuthContext.Provider
          value={{
            user,
            userType,
            isLoading,
            login,
            logout,
            refetchUser,
          }}
      >
        {children}
      </AuthContext.Provider>
  );
};