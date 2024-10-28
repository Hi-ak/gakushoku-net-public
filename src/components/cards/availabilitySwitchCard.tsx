import { Menu } from "@/common/types/menu";

import styles from "@/common/styles/components/cards/availabilitySwitchCard.module.scss";
import { jsonFetch } from "@/common/utils/customFetch";
import {
  AvailabilityPutRequestBody,
  AvailabilityPutResponseBody,
} from "@/app/api/cafeteria/menu/update-availability/route";
import { ServiceStatus } from "@prisma/client";
import { ApiResponse } from "@/common/types/apiResponse";

export const AvailabilitySwitchCard: React.FC<{
  menu: Menu;
  sales: number;
  isAvailable: boolean;
}> = ({ menu, sales, isAvailable }) => {
  const onInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    var res = await jsonFetch(
      "/api/cafeteria/menu/update-availability",
      "PUT",
      {
        id: menu.id,
        serviceStatus: e.target.checked
          ? ServiceStatus.AVAILABLE
          : ServiceStatus.SOLD_OUT,
      } as AvailabilityPutRequestBody
    );
    const data: AvailabilityPutResponseBody = await res.json();
    if (data.success) {
      target.checked = data.additionalData.currentStatus === "AVAILABLE";
    } else {
      alert("このメニューは提供停止中です。");
      target.checked = false;
    }
  };
  return (
    <div className={styles.cardContainer}>
      <h3 className={styles.menuTitle}>{menu.title}</h3>
      <div className={styles.sales}>{sales}枚</div>
      <div className={styles.toggleContainer}>
        <input
          type="checkbox"
          id={`toggle_input_${menu.id}`}
          className={styles.toggleInput}
          defaultChecked={isAvailable}
          onChange={onInput}
        />
        <label htmlFor={`toggle_input_${menu.id}`}>
          <span></span>
        </label>
        <div className={styles.switchCircle} />
      </div>
      <div className={styles.bottomLine} />
    </div>
  );
};
