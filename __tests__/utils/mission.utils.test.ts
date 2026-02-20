import { isMissionFinished, mapApiToMission, mapMissionPublicToMission } from "@/utils/mission.utils";

describe("utils/mission.utils", () => {
    test("isMissionFinished returns false if no date_end", () => {
        expect(isMissionFinished({} as any)).toBe(false);
    });

    test("isMissionFinished returns false if invalid date_end", () => {
        expect(isMissionFinished({ date_end: "not-a-date" } as any)).toBe(false);
    });

    test("isMissionFinished returns true if end date in past", () => {
        expect(isMissionFinished({ date_end: "2000-01-01" } as any)).toBe(true);
    });

    test("mapApiToMission maps first category + computed fields", () => {
        const data = {
            id_mission: 1,
            categories: [{ id_categ: 5, name: "Food" }],
        };
        const m = mapApiToMission(data);

        expect(m.category).toEqual({ id_categ: 5, name: "Food" });
        expect(m.id_categ).toBe(5);
        expect(m.volunteers_enrolled).toBe(0);
        expect(m.available_slots).toBe(0);
        expect(m.is_full).toBe(false);
    });

    test("mapMissionPublicToMission keeps fields", () => {
        const pub: any = { id_mission: 1, name: "X", description: "D" };
        const m = mapMissionPublicToMission(pub);
        expect(m.id_mission).toBe(1);
        expect(m.name).toBe("X");
        expect(m.description).toBe("D");
    });
});
