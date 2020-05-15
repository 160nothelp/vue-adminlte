import { getConversionTime } from '../utils/index'

export const parseDate = datestr => {
    if (datestr !== undefined) {
        const date = datestr.slice(0, 10);
        const time = datestr.slice(11, 19);
        return date + ' ' + time
        }
};

//websocket +8 小时
export const formatDate = datestr => {
    if (datestr !== undefined) {
      let new_time = getConversionTime(datestr);
      const h = new_time.slice(8, 10);
      const m = new_time.slice(10, 12);
        return h + ':' + m
    }
};

