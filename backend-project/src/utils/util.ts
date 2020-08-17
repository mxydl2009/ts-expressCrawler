// 用来规定后端接口返回的数据格式，便于前后端分离操作
interface Result<T> {
  success: boolean;
  errMsg?: string;
  data: T;
}
// 用于返回符合Result格式的数据
export const getResponseData = <T>(data: T, errMsg?: string): Result<T> => {
  if (errMsg) {
    return {
      success: false,
      errMsg,
      data
    };
  }
  return {
    success: true,
    data
  };
};
