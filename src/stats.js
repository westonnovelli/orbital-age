const DAYS_PER_ORBIT = 365.25;
const KM_PER_ORBIT = 940_000_000;

export function orbitsCompleted(elapsedDays) {
  return Math.floor(elapsedDays / DAYS_PER_ORBIT);
}

export function currentAge(elapsedDays) {
  const years = Math.floor(elapsedDays / DAYS_PER_ORBIT);
  const remainingDays = Math.floor(elapsedDays - years * DAYS_PER_ORBIT);
  return `${years}y ${remainingDays}d`;
}

export function distanceTraveledKm(elapsedDays) {
  return (elapsedDays / DAYS_PER_ORBIT) * KM_PER_ORBIT;
}
