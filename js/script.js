/* 高明之选 PPT · 大疆风官网交互 */

// —— 联系方式占位（皇上在此替换为真实信息）——
const CONTACT = {
  wechat: '请填写微信号',
  email: '请填写邮箱'
};

document.addEventListener('DOMContentLoaded', function () {

  // 填充页脚联系方式
  const wechatText = document.getElementById('wechatText');
  const emailText = document.getElementById('emailText');
  if (wechatText) wechatText.textContent = CONTACT.wechat;
  if (emailText) emailText.textContent = CONTACT.email;

  // —— 移动端菜单 ——
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('nav__links--open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('nav__links--open'); });
    });
  }

  // —— 滚动导航阴影 ——
  const nav = document.getElementById('nav');
  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 20) nav.classList.add('nav--scrolled');
    else nav.classList.remove('nav--scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // —— 滚动揭示 ——
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('reveal--in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('reveal--in'); });
  }

  // —— Toast ——
  const toast = document.getElementById('toast');
  let toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('toast--show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('toast--show');
    }, 2600);
  }

  // —— 复制微信 ——
  const copyBtn = document.getElementById('copyWechat');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      const wx = CONTACT.wechat;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(wx).then(function () {
          showToast('已复制微信：' + wx);
        }).catch(function () { showToast('微信号：' + wx); });
      } else {
        showToast('微信号：' + wx);
      }
    });
  }

  // —— 表单提交（当前为本地 Mock，真实环境接飞书多维表 Webhook）——
  const form = document.getElementById('leadForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = {
        name: form.name.value.trim(),
        org: form.org.value.trim(),
        scene: form.scene.value.trim(),
        deadline: form.deadline.value.trim(),
        pain: form.pain.value.trim(),
        contact: form.contact.value.trim()
      };
      if (!data.name) { showToast('请填写称呼'); return; }
      if (!data.contact) { showToast('请填写联系方式'); return; }

      // TODO: 接飞书多维表 Webhook 收口线索
      // fetch('https://open.feishu.cn/open-apis/bot/v2/hook/xxx', {...})
      console.log('线索提交（Mock）:', data);
      showToast('提交成功，24 小时内人工反馈');
      form.reset();
    });
  }
});
