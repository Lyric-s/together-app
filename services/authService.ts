import api from './api';
import { storageService } from './storageService';
import { volunteerService } from './volunteerService';
import { UserCreate } from '@/models/user.model';
import { VolunteerCreate } from '@/models/volunteer.model';
import { AssociationCreate } from '@/models/association.model';
import { UserType } from "@/models/enums";
import { associationService } from './associationService';

interface RegisterPayload {
  email: string;
  password: string;
  username: string;
  type: UserType.VOLUNTEER | UserType.ASSOCIATION;
  // Volunteer fields
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  birthdate?: string;
  skills?: string;
  bio?: string;
  // Association fields
  name?: string;
  company_name?: string;
  rna_code?: string;
  address?: string;
  zip_code?: string;
  country?: string;
  description?: string;
}
export const authService = {
  // Corresponds to @router.post("/token")
  login: async (username: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    const response = await api.post('/auth/token', formData.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const { access_token, refresh_token, user_type } = response.data;
    await storageService.saveTokens(access_token, refresh_token);
    if(user_type) await storageService.setItem('user_type', user_type);
    return response.data;
  },

  // Corresponds to @router.post("/refresh")
  refresh: async () => {
    const refreshToken = await storageService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    const response = await api.post('/auth/refresh', { refresh_token: refreshToken });
    const { access_token } = response.data;
    const newRefresh = response.data.refresh_token || refreshToken;
    await storageService.saveTokens(access_token, newRefresh);
    return access_token;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  requestPasswordReset: async (email: string) => {
    return await api.post('/auth/password-reset/request', { email });
  },

  confirmPasswordReset: async (token: string, newPassword: string) => {
    return await api.post('/auth/password-reset/confirm', { 
        token: token, 
        new_password: newPassword 
    });
  },
  
  register: async (payload: RegisterPayload) => {
    try {
      if (!payload.email || !payload.username || !payload.password || !payload.type) {
        throw new Error('Missing required fields: email, username, password, and type');
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(payload.email)) {
        throw new Error('Invalid email format');
      }

      const { email, password, username, type } = payload;
      const userIn: UserCreate = {
        email: email,
        password: password,
        username: username || email.split('@')[0],
        user_type: type === UserType.VOLUNTEER ? UserType.VOLUNTEER : UserType.ASSOCIATION
      };

      if (type === UserType.VOLUNTEER) {
        if (!payload.first_name || !payload.phone_number || !payload.last_name || !payload.birthdate) {
          throw new Error('Volunteer registration requires first_name, last_name, birthdate and phone_number');
        }
        const volunteerIn: VolunteerCreate = {
          first_name: payload.first_name,
          last_name: payload.last_name,
          phone_number: payload.phone_number, 
          birthdate: payload.birthdate,
          address: payload.address || "",
          zip_code: payload.zip_code || "",
          skills: payload.skills || "",
          bio: payload.bio || ""
        };
        
        await volunteerService.register(userIn, volunteerIn);

      } else {
        if (!payload.name || !payload.phone_number || !payload.company_name || !payload.rna_code || !payload.address || !payload.zip_code || !payload.country || !payload.description) {
          throw new Error('Association registration requires name, company_name, rna_code, phone_number, address, zip_code, country, description');
        }
        const associationIn: AssociationCreate = {
          name: payload.name,
          company_name: payload.company_name,
          rna_code: payload.rna_code,
          phone_number: payload.phone_number,
          address: payload.address,
          zip_code: payload.zip_code,
          country: payload.country,
          description: payload.description
        };

        await associationService.create(userIn, associationIn);
      }

      // --- AUTO-LOGIN ---
      console.log(`✅ Création ${type} réussie, tentative de connexion...`);
      return await authService.login(userIn.username, password);

    } catch (error: any) {
      const errorDetail = error.response?.data?.detail;
      console.error("Register Error:", errorDetail || error.message);
      throw error;
    }
  }
};