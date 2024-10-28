import { prisma } from "../utils/prisma";

export interface Time {
  hours: number;
  min: number;
}

export const getStartBuyingTime = async (
  cafeteriaHandle: string
): Promise<Time> => {
  const { ticketBuyableStartAtHour, ticketBuyableStartAtMinute } =
    await prisma.parameter.findUnique({
      where: { cafeteriaHandle },
      select: {
        ticketBuyableStartAtHour: true,
        ticketBuyableStartAtMinute: true,
      },
    });
  return {
    hours: ticketBuyableStartAtHour,
    min: ticketBuyableStartAtMinute,
  };
};

export const getEndBuyingTime = async (
  cafeteriaHandle: string
): Promise<Time> => {
  const { ticketBuyableEndAtHour, ticketBuyableEndAtMinute } =
    await prisma.parameter.findUnique({
      where: { cafeteriaHandle },
      select: {
        ticketBuyableEndAtHour: true,
        ticketBuyableEndAtMinute: true,
      },
    });
  return {
    hours: ticketBuyableEndAtHour,
    min: ticketBuyableEndAtMinute,
  };
};

export const getCafeteriaOpenTime = async (
  cafeteriaHandle: string
): Promise<Time> => {
  const { cafeteriaOpenAtHour, cafeteriaOpenAtMinute } =
    await prisma.parameter.findUnique({
      where: { cafeteriaHandle },
      select: {
        cafeteriaOpenAtHour: true,
        cafeteriaOpenAtMinute: true,
      },
    });
  return {
    hours: cafeteriaOpenAtHour,
    min: cafeteriaOpenAtMinute,
  };
};

export const getCafeteriaCloseTime = async (
  cafeteriaHandle: string
): Promise<Time> => {
  const { cafeteriaCloseAtHour, cafeteriaCloseAtMinute } =
    await prisma.parameter.findUnique({
      where: { cafeteriaHandle },
      select: {
        cafeteriaCloseAtHour: true,
        cafeteriaCloseAtMinute: true,
      },
    });
  return {
    hours: cafeteriaCloseAtHour,
    min: cafeteriaCloseAtMinute,
  };
};

export const getHourTimeDelta = async (
  cafeteriaHandle: string
): Promise<number> => {
  const { timezoneHourTimeDelta } = await prisma.parameter.findUnique({
    where: { cafeteriaHandle },
    select: {
      timezoneHourTimeDelta: true,
    },
  });
  return timezoneHourTimeDelta;
};

export const getMinuteTimeDelta = async (
  cafeteriaHandle: string
): Promise<number> => {
  const { timezoneMinuteTimeDelta } = await prisma.parameter.findUnique({
    where: { cafeteriaHandle },
    select: {
      timezoneMinuteTimeDelta: true,
    },
  });
  return timezoneMinuteTimeDelta;
};
