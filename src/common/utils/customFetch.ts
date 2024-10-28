import { ApiMethod } from "../types/apiMethods";

/**
 * fetch 関数の便利なラッパです。
 * ## 使い方
 * 基本的に `endpoint`、`method`、`body` の三つの引数を渡すだけで良いです。
 * ## 引数の説明
 * @param endpoint `https://torasuzu.com` （あるいは `http://localhost` ） よりもあとのパスです。スラッシュ `/` から入力してください。
 * @param method リクエストのメソッドです。
 * @param body リクエストのボディです。
 * @param contentType リクエストの内容の形式です。デフォルトは `application/json` です。
 * @param additionalInit 追加で指定したい `fetch` 関数の `init` を指定します。
 * @param additionalHeader 追加で指定したいヘッダを指定します。
 * @param host デフォルトはパスのみで `fetch` しますが、ホスト情報もいる場合にはこちらにホスト情報を渡します。例: `http://localhost`
 *
 * 参考に、実際に `fetch` をするときは以下のようになります。
 * ```
 * fetch(`${host}${endpoint}`, ...)
 * ```
 * ## 返り値
 * 一般的な `fetch` 関数と同じです。
 */
export const customFetch = async (
  endpoint: string,
  method: ApiMethod = "GET",
  body?: BodyInit,
  contentType: string = "application/json",
  additionalInit: RequestInit = {},
  additionalHeader: HeadersInit = {},
  host: string = ""
): Promise<Response> => {
  const headers = { "Content-Type": contentType, ...additionalHeader };
  const init: RequestInit = { method, headers, body, ...additionalInit };
  return await fetch(`${host}${endpoint}`, init);
};

export const jsonFetch = async <Type = Object>(
  endpoint: string,
  method: ApiMethod = "POST",
  jsonData?: Type,
  additionalInit: RequestInit = {},
  additionalHeader: HeadersInit = {},
  host: string = ""
): Promise<Response> => {
  return await customFetch(
    endpoint,
    method,
    JSON.stringify(jsonData),
    "application/json",
    additionalInit,
    additionalHeader,
    host
  );
};
