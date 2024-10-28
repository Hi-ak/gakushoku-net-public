"use client";
import { ParameterPutRequestBody } from "@/app/api/dev/parameter/route";
import { jsonFetch } from "@/common/utils/customFetch";
import { DaySetting, Parameter } from "@prisma/client";
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  useState,
} from "react";

const cafeteriaTimeKeyDescriptions = [
  "食堂開店時刻",
  "食堂閉店時刻",
  "食券購入開始時刻",
  "食券購入終了時刻",
];

const InputElement: React.FC<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
> = (props) => {
  const className = ["border-b-2 pl-[2px]", props.className].join(" ");
  return (
    <input {...props} className={[className, "text-right"].join(" ")}></input>
  );
};

const CafeteriaTimeInputElement: React.FC<{
  parameter: Parameter;
  name: string;
  setParameter: (Parameter) => void;
}> = ({ parameter, name, setParameter }) => {
  return (
    <InputElement
      type="number"
      maxLength={2}
      className="w-10"
      defaultValue={parameter[name].toString()}
      onFocus={(e) => e.target.select()}
      onChange={(e) => {
        setParameter((parameter) => ({
          ...parameter,
          [name]: parseInt(e.target.value),
        }));
      }}
    ></InputElement>
  );
};

const CafeteriaTimeInput: React.FC<{
  name: string;
  idx: number;
  parameter: Parameter;
  setParameter: (Parameter) => void;
}> = ({ name, idx, parameter, setParameter }) => {
  return (
    <tr>
      <td>{cafeteriaTimeKeyDescriptions[idx]}</td>
      <td>
        <CafeteriaTimeInputElement
          parameter={parameter}
          name={name + "Hour"}
          setParameter={setParameter}
        />
        時
        <CafeteriaTimeInputElement
          parameter={parameter}
          name={name + "Minute"}
          setParameter={setParameter}
        />
        分
      </td>
    </tr>
  );
};

const CafeteriaTimeInputContainer: React.FC<{
  parameter: Parameter;
  setParameter: (Parameter) => void;
}> = ({ parameter, setParameter }) => {
  return (
    <table className="border-separate border-spacing-2">
      <tbody>
        {[
          "cafeteriaOpenAt",
          "cafeteriaCloseAt",
          "ticketBuyableStartAt",
          "ticketBuyableEndAt",
        ].map((key, idx) => (
          <CafeteriaTimeInput
            key={key}
            idx={idx}
            name={key}
            parameter={parameter}
            setParameter={setParameter}
          />
        ))}
      </tbody>
    </table>
  );
};

const Heading: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <h2 className="my-5">{children}</h2>;
};

export const ParameterPageContent: React.FC<{
  cafeteriaHandle: string;
  parameter: Parameter;
  daySetting: DaySetting;
}> = ({
  cafeteriaHandle,
  parameter: defaultParameter,
  daySetting: defaultDaySetting,
}) => {
  const [parameter, setParameter] = useState<Parameter>(defaultParameter);
  const [daySetting, setDaySetting] = useState<DaySetting>(defaultDaySetting);
  return (
    <div className="px-12 py-8 grow">
      <div className="flex flex-row flex-wrap justify-around">
        <div>
          <Heading>
            食堂営業時間及び
            <br />
            食券購入可能時間
          </Heading>
          <CafeteriaTimeInputContainer
            parameter={parameter}
            setParameter={setParameter}
          />
        </div>
        <div>
          <Heading>タイムゾーン</Heading>
          <div className="flex flex-row gap-4">
            <div>時差</div>
            <div>
              <InputElement
                className="w-10"
                defaultValue={parameter.timezoneHourTimeDelta.toString()}
                onFocus={(e) => e.target.select()}
                type="number"
                onChange={(e) => {
                  setParameter((parameter) => ({
                    ...parameter,
                    timezoneHourTimeDelta: parseInt(e.target.value),
                  }));
                }}
              ></InputElement>
              時間
              <InputElement
                className="w-10"
                defaultValue={parameter.timezoneMinuteTimeDelta.toString()}
                onFocus={(e) => e.target.select()}
                type="number"
                onChange={(e) => {
                  setParameter((parameter) => ({
                    ...parameter,
                    timezoneMinuteTimeDelta: parseInt(e.target.value),
                  }));
                }}
              ></InputElement>
              分
            </div>
          </div>
        </div>
        <div>
          <Heading>API 時間</Heading>
          <div className="flex flex-row gap-4 justify-between">
            <div>CartTicketタイムアウト時間</div>
            <div>
              <InputElement
                type="number"
                className="w-28"
                defaultValue={parameter.timeToDeleteCartTicketMilliseconds.toString()}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  setParameter((parameter) => ({
                    ...parameter,
                    timeToDeleteCartTicketMilliseconds: parseInt(
                      e.target.value
                    ),
                  }));
                }}
              ></InputElement>
              ミリ秒
            </div>
          </div>
          <div className="flex flex-row gap-4 justify-between">
            <div>購入タイムアウト時間</div>
            <div>
              <InputElement
                type="number"
                className="w-28"
                defaultValue={parameter.timeToTimeoutAtPurchaseMilliseconds.toString()}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  setParameter((parameter) => ({
                    ...parameter,
                    timeToTimeoutAtPurchaseMilliseconds: parseInt(
                      e.target.value
                    ),
                  }));
                }}
              ></InputElement>
              ミリ秒
            </div>
          </div>
          <div className="flex flex-row gap-4 justify-between">
            <div>注文受付時間</div>
            <div>
              <InputElement
                type="number"
                className="w-28"
                defaultValue={parameter.orderDurationMilliseconds.toString()}
                onFocus={(e) => e.target.select()}
                onChange={(e) => {
                  setParameter((parameter) => ({
                    ...parameter,
                    orderDurationMilliseconds: parseInt(e.target.value),
                  }));
                }}
              ></InputElement>
              ミリ秒
            </div>
          </div>
        </div>
      </div>
      <Heading>曜日ごとの営業</Heading>
      <table className="border-separate border-spacing-[4px] border">
        <thead className="font-bold">
          <tr className="text-center">
            <td></td>
            <td>月</td>
            <td>火</td>
            <td>水</td>
            <td>木</td>
            <td>金</td>
            <td className="text-[blue]">土</td>
            <td className="text-[red]">日</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>営業の有無</td>
            {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((day) => (
              <td key={day}>
                <select
                  name={day}
                  className="border rounded"
                  onChange={(e) => {
                    const target = e.currentTarget;
                    setDaySetting((daySetting) => ({
                      ...daySetting,
                      [day]: target.value === "open",
                    }));
                  }}
                  defaultValue={daySetting[day] ? "open" : "close"}
                >
                  <option value="open">営業</option>
                  <option value="close">閉業</option>
                </select>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <button
        className="m-5 px-3 py-1 border-2 rounded-lg cursor-pointer select-none"
        onClick={async () => {
          const json: ParameterPutRequestBody = {
            cafeteriaHandle,
            parameter,
            daySetting,
          };
          console.dir(json);
          const res = await jsonFetch("/api/dev/parameter", "PUT", json);
        }}
      >
        保存
      </button>
    </div>
  );
};
