// displayLocale 系は日本語表示のこと
// 表示する時間は Locale のありとなしでは変化はない

export const getLocaleTime = (
  time: string | Date | number,
  second: boolean = false
) => {
  const date = new Date(time);
  return `${"00".slice(date.getHours().toString().length) + date.getHours()}時${
    "00".slice(date.getMinutes().toString().length) + date.getMinutes()
  }分${
    second
      ? `${
          "00".slice(date.getSeconds().toString().length) + date.getSeconds()
        }秒`
      : ""
  }`;
};

export const getLocaleDate = (time: string | Date | number) => {
  const date = new Date(time);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
};

export const getLocaleDateTime = (time: string | Date | number) => {
  return `${getLocaleDate(time)} ${getLocaleTime(time)}`;
};

export const getTime = (
  time: string | Date | number,
  second: boolean = false,
  millisecond: boolean = false
) => {
  const date = new Date(time);
  return `${"00".slice(date.getHours().toString().length) + date.getHours()}:${
    "00".slice(date.getMinutes().toString().length) + date.getMinutes()
  }${
    second
      ? `:${
          "00".slice(date.getSeconds().toString().length) + date.getSeconds()
        }`
      : ""
  }${
    millisecond
      ? `.${
          "000".slice(date.getMilliseconds().toString().length) +
          date.getMilliseconds()
        }`
      : ""
  }`;
};

export const getDate = (
  time: string | Date | number,
  startWith: "year" | "month" | "date" = "year"
) => {
  const date = new Date(time);
  const list = [
    date.getFullYear().toString(),
    "00".slice(date.getMonth().toString().length) + (date.getMonth() + 1),
    "00".slice(date.getDate().toString().length) + date.getDate(),
  ];
  if (startWith === "year") {
    return list.join("/");
  } else if (startWith === "month") {
    return list.slice(1).join("/");
  } else if (startWith === "date") {
    return list[2];
  }
};

export const getElapsedDays = (time: string | Date | number) => {
  const date = new Date(time);
  const now = new Date();
  const elapsed = now.getTime() - date.getTime();
  return Math.floor(elapsed / (1000 * 60 * 60 * 24));
};

export const getLocaleElapsedDays = (time: string | Date | number) => {
  const elapsed = getElapsedDays(time);
  if (elapsed === 0) {
    return "今日";
  } else if (elapsed === 1) {
    return "昨日";
  } else if (elapsed < 30) {
    return `${elapsed}日前`;
  } else if (elapsed < 365) {
    return `${Math.floor(elapsed / 30)}ヶ月前`;
  } else {
    return `${Math.floor(elapsed / 365)}年前`;
  }
};

export const getLocaleDay = (time: string | Date | number) => {
  const date = new Date(time);
  const day = date.getDay();
  const dayList = ["日", "月", "火", "水", "木", "金", "土"];
  return dayList[day];
};
