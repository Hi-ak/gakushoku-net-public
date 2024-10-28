import styles from "@/common/styles/components/pulldowns/monthSelectPulldown.module.scss";

export const MonthSelectPulldown: React.FC<{
  fromYear: number;
  fromMonth: number;
  toYear: number;
  toMonth: number;
  order?: string;
  setYear: (year: number) => void;
  setMonth: (month: number) => void;
}> = ({
  fromYear,
  fromMonth,
  toYear,
  toMonth,
  order = "asc",
  setYear,
  setMonth,
}) => {
  if (new Date(fromYear, fromMonth - 1) > new Date(toYear, toMonth - 1)) {
    console.warn("Invalid Input for MonthSelectPulldown.tsx");
    return <div>エラー</div>;
  }

  const optionStrings: string[] = [];

  let m = fromMonth;

  for (let y = fromYear; y <= toYear; y++) {
    for (; m <= 12; m++) {
      optionStrings.push(`${y}年${m}月`);
      if ((y == toYear && m == toMonth) || m == 12) {
        break;
      }
    }

    m = 1;
  }

  if (order == "desc") {
    //昇順がデフォルト
    optionStrings.reverse();
  }
  return (
    <div className={styles.container}>
      <select
        onChange={(e) => {
          const selected = optionStrings[e.target.selectedIndex];
          const d = selected
            .replace("年", " ")
            .replace("月", " ")
            .split(" ")
            .filter((item) => item != "")
            .map((item) => parseInt(item));
          setYear(d[0]);
          setMonth(d[1]);
        }}
      >
        {optionStrings.map((option) => {
          return (
            <option value={option} key={option}>
              {option}
            </option>
          );
        })}
      </select>
    </div>
  );
};
