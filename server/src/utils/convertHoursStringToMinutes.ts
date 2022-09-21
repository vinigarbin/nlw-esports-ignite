export default function convertHoursStringToMinutes(hoursString: string) {
  console.log(hoursString);
  const [hours, minutes] = hoursString
    ?.split(':')
    ?.map(number => Number(number));

  const minutesAmout = hours * 60 + minutes;

  return minutesAmout;
}
