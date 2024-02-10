import dayjs from 'dayjs'

export function toDateString(date) {
  return dayjs(date).format('YYYY-MM-DD')
}
