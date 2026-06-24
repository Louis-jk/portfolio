export function parseProjectId(id: string): number | null {
  if (!/^\d+$/.test(id)) return null;

  const projectId = Number(id);
  if (!Number.isInteger(projectId) || projectId <= 0) return null;

  return projectId;
}
