import { TeamMember } from "../types/task";

export const TEAM_MEMBERS: TeamMember[] = [
  { id: "usr_1", name: "Sarah Ahmed", role: "Product Lead", avatarInitials: "SA" },
  { id: "usr_2", name: "Marcus Chen", role: "Backend Engineer", avatarInitials: "MC" },
  { id: "usr_3", name: "Elena Rostova", role: "Frontend Engineer", avatarInitials: "ER" },
  { id: "usr_4", name: "Bartholomew-Wellington Montgomery III", role: "Principal Architect", avatarInitials: "BM" },
  { id: "usr_5", name: "Zoe Alvarez", role: "Product Designer", avatarInitials: "ZA" },
  { id: "usr_6", name: "Liam O'Connor", role: "DevOps Engineer", avatarInitials: "LO" },
  { id: "usr_7", name: "Priya Patel", role: "QA Engineer", avatarInitials: "PP" },
  { id: "usr_8", name: "David Kim", role: "Data Engineer", avatarInitials: "DK" },
  { id: "usr_9", name: "Fatima Al-Mansoor", role: "Mobile Engineer", avatarInitials: "FA" },
  { id: "usr_10", name: "Alexandre Dupont", role: "Security Engineer", avatarInitials: "AD" }
];

export function getTeamMember(id?: string): TeamMember | undefined {
  if (!id) return undefined;
  return TEAM_MEMBERS.find((m) => m.id === id);
}
