import {
  getCafeteriaCloseTime,
  getCafeteriaOpenTime,
  getEndBuyingTime,
  getHourTimeDelta,
  getMinuteTimeDelta,
  getStartBuyingTime,
  Time,
} from "../var/cafeteriaTime";
import { prisma } from "./prisma";

const getTime = async (time: Time, cafeteriaHandle: string) => {
  const hourTimeDelta = await getHourTimeDelta(cafeteriaHandle);
  const minuteTimeDelta = await getMinuteTimeDelta(cafeteriaHandle);
  const UTCPlusJST = new Date();
  UTCPlusJST.setUTCHours(
    UTCPlusJST.getUTCHours() + hourTimeDelta,
    UTCPlusJST.getUTCMinutes() + minuteTimeDelta
  );
  const date = new Date(UTCPlusJST);
  date.setUTCHours(
    time.hours - hourTimeDelta,
    time.min - minuteTimeDelta,
    0,
    0
  );
  return date;
};

const numberDayBind: { [key: string]: string } = {
  "0": "sun",
  "1": "mon",
  "2": "tue",
  "3": "wed",
  "4": "thu",
  "5": "fri",
  "6": "sat",
};

export const getTicketBuyingStartTime = async (cafeteriaHandle: string) => {
  return await getTime(
    await getStartBuyingTime(cafeteriaHandle),
    cafeteriaHandle
  );
};

export const getTicketBuyingEndTime = async (cafeteriaHandle: string) => {
  return await getTime(
    await getEndBuyingTime(cafeteriaHandle),
    cafeteriaHandle
  );
};

export const getIsTicketBuyable = async (cafeteriaHandle: string) => {
  const now = new Date();
  const operationStart = await getTicketBuyingStartTime(cafeteriaHandle);

  const operationEnd = await getTicketBuyingEndTime(cafeteriaHandle);

  let isOperating = operationStart < now && now < operationEnd;

  const nowJST = new Date();
  nowJST.setUTCHours(nowJST.getUTCHours() + 9); //土日はアプリ購入できないように
  const daySetting = await prisma.daySetting.findUnique({
    where: { cafeteriaHandle },
    select: {
      [numberDayBind[nowJST.getUTCDay()]]: true,
    },
  });
  if (daySetting[numberDayBind[nowJST.getUTCDay()]] === false) {
    isOperating = false;
  }

  return isOperating;
};

export const getIsCafeteriaOpen = async (cafeteriaHandle: string) => {
  const now = new Date();
  const operationStart = await getTime(
    await getCafeteriaOpenTime(cafeteriaHandle),
    cafeteriaHandle
  );
  const operationEnd = await getTime(
    await getCafeteriaCloseTime(cafeteriaHandle),
    cafeteriaHandle
  );
  return operationStart < now && now < operationEnd;
};
