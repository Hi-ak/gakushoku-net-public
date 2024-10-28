import { NextPage } from "next";

import styles from "@/common/styles/app/client/tokusho.module.scss";

const TokushoPage: NextPage = async () => (
  <>
    <div className={styles.tableContainer}>
      <h3>特定商取引法に基づく表記</h3>
      <table>
        <tr>
          <th>番号</th>
          <th>項目</th>
          <th>内容</th>
          <th>備考</th>
        </tr>
        <tr>
          <td>1</td>
          <td>サイト名</td>
          <td>学食ネット</td>
          <td></td>
        </tr>
        <tr>
          <td>2</td>
          <td>事業者名・住所</td>
          <td>
            株式会社トラスティフード
            <br />
            〒110-0015　東京都台東区東上野1-14-4
            <br />
            野村不動産上野ビル4階
          </td>
          <td>※食堂運営会社の情報を記載</td>
        </tr>
        <tr>
          <td>3</td>
          <td>事業者連絡先</td>
          <td>TEL 03-3836-1285（代）</td>
          <td>※食堂運営会社の情報を記載</td>
        </tr>
        <tr>
          <td>4</td>
          <td>代表者</td>
          <td>代表取締役社長 荻久保 英男</td>
          <td></td>
        </tr>
        <tr>
          <td>5</td>
          <td>提供商品</td>
          <td>開成高校食堂で利用可能な食券</td>
          <td>※食堂運営会社の情報を記載</td>
        </tr>
        <tr>
          <td>6</td>
          <td>販売価格</td>
          <td>各商品に税込価格で表示いたします。</td>
          <td></td>
        </tr>
        <tr>
          <td>7</td>
          <td>お支払い方法と時期</td>
          <td>PayPay決済 ： 食券購入時にお支払いが確定します。</td>
          <td></td>
        </tr>
        <tr>
          <td>8</td>
          <td>商品の引き渡し時期</td>
          <td>
            お支払い手続き完了後、ただちにサイトにアクセスしているデバイスのディスプレイに表示する方法で引き渡します。
          </td>
          <td></td>
        </tr>
        <tr>
          <td>9</td>
          <td>商品の返品・交換・返金について</td>
          <td>
            ・食券購入後、「注文する」操作を行わずに未使用の状態である場合、購入日の23:59までにPayPay決済にて取引が取り消され返金されます。
            <br />
            ・お客様都合の返金・交換はできません。
          </td>
          <td></td>
        </tr>
      </table>
    </div>
  </>
);

export default TokushoPage;
