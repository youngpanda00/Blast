/**
 * 自动记录跳转点击 - 获取参数、判断存在、执行请求
 */
export const autoRecordJumpClick = async () => {
  try {
    console.log('autoRecordJumpClick')
    // 获取参数
    const param = new URLSearchParams(window.location.search).get("param");
    
    // 判断存在
    if (!param) return;
    
    // 执行请求
    const response = await fetch(`/api-blast/promotion/record-jump-click?param=${param}`, {
      method: "GET",
    });
    
    if (response.ok) {
      console.log("Jump click recorded successfully for param:", param);
    }
  } catch (error) {
    console.debug("Jump click recording failed:", error);
  }
};
