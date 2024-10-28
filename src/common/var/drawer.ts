export const drawerContents: { name: string; url: string }[] = [
  { name: "メニュー", url: "/menu" },
  { name: "購入済み食券", url: "/my-tickets" },
  { name: "購入履歴", url: "/history" },
  { name: "利用案内", url: "/guide" },
  { name: "利用規約", url: "/terms" },
];

export const adminDrawerContents: { name: string; url: string }[] = [
  { name: "ダッシュボード", url: "/cafeteria/dashboard" },
  { name: "売切・販売再開", url: "/cafeteria/menu/availability-control" },
  { name: "メニュー編集", url: "/cafeteria/menu/list" },
  { name: "メニューを事前設定", url: "/cafeteria/menu/preset" },
  { name: "メニューの順番を変更", url: "/cafeteria/menu/index-control" },
  { name: "オプション編集", url: "/cafeteria/option/list" },
  { name: "売上確認", url: "/cafeteria/sales" },
];

export const devDrawerContents: { name: string; url: string }[] = [
  { name: "手動返金", url: "/dev/manual-refund" },
  { name: "パラメータ設定", url: "/dev/parameter" },
  { name: "パラメータ初期化", url: "/dev/parameter/init" },
];
