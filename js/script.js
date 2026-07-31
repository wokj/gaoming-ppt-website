/* 高明之选 PPT · 大疆风官网交互 */

// —— 联系方式（已由皇上确认）——
const CONTACT = {
  wechat: 'gmzxppt',
  email: '923498884@qq.com'
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

  // ===== 模板商城瀑布流 =====
  let GOODS_DATA = null;

  async function loadGoods() {
    try {
      const resp = await fetch('data/goods.json');
      GOODS_DATA = await resp.json();
      renderMall('全部');
      renderCourses();
    } catch (e) {
      console.warn('goods.json 加载失败，商城板块为空', e);
    }
  }

  function renderMall(tag) {
    const grid = document.getElementById('mallGrid');
    const empty = document.getElementById('mallEmpty');
    if (!grid || !GOODS_DATA) return;
    let items = GOODS_DATA.templates;
    if (tag && tag !== '全部') {
      items = items.filter(function (t) { return t.tags.indexOf(tag) !== -1; });
    }
    if (items.length === 0) {
      grid.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';
    grid.innerHTML = items.map(function (t) {
      var tagsHtml = t.tags.map(function (tg) {
        return '<span class="tag">' + tg + '</span>';
      }).join('');
      var oldPrice = t.originalPrice ? '<span class="mall-card__old">¥' + t.originalPrice + '</span>' : '';
      return '' +
        '<div class="mall-card" onclick="buyGood(\'' + t.id + '\')">' +
          '<img class="mall-card__cover" src="' + t.cover + '" alt="' + t.title + '" loading="lazy">' +
          '<div class="mall-card__body">' +
            '<div class="mall-card__tags">' + tagsHtml + '</div>' +
            '<div class="mall-card__title">' + t.title + '</div>' +
            '<div class="mall-card__desc">' + t.desc + '</div>' +
            '<div class="mall-card__footer">' +
              '<div class="mall-card__price">' +
                '<span class="mall-card__now">¥' + t.price + '</span>' + oldPrice +
              '</div>' +
              '<button class="mall-card__buy" onclick="event.stopPropagation();buyGood(\'' + t.id + '\')">立即购买</button>' +
            '</div>' +
            '<div class="mall-card__meta">已售 ' + t.sales + ' 份</div>' +
          '</div>' +
        '</div>';
    }).join('');
  }

  function renderCourses() {
    var grid = document.getElementById('courseGrid');
    if (!grid || !GOODS_DATA) return;
    grid.innerHTML = GOODS_DATA.courses.map(function (c) {
      var tagsHtml = c.tags.map(function (tg) {
        return '<span class="tag">' + tg + '</span>';
      }).join('');
      var oldPrice = c.originalPrice ? '<span class="course-card__old">¥' + c.originalPrice + '</span>' : '';
      return '' +
        '<div class="course-card" onclick="buyGood(\'' + c.id + '\')">' +
          '<img class="course-card__cover" src="' + c.cover + '" alt="' + c.title + '" loading="lazy">' +
          '<div class="course-card__body">' +
            '<div class="mall-card__tags">' + tagsHtml + '</div>' +
            '<div class="course-card__title">' + c.title + '</div>' +
            '<div class="course-card__desc">' + c.desc + '</div>' +
            '<div class="course-card__footer">' +
              '<div class="course-card__price">' +
                '<span class="course-card__now">¥' + c.price + '</span>' + oldPrice +
              '</div>' +
              '<button class="course-card__buy" onclick="event.stopPropagation();buyGood(\'' + c.id + '\')">立即购买</button>' +
            '</div>' +
            '<div class="course-card__meta">已购 ' + c.sales + ' 人</div>' +
          '</div>' +
        '</div>';
    }).join('');
  }

  // 标签筛选
  var filterWrap = document.getElementById('mallFilter');
  if (filterWrap) {
    filterWrap.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        filterWrap.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('on'); });
        chip.classList.add('on');
        renderMall(chip.getAttribute('data-tag'));
      });
    });
  }

  // 启动数据加载
  loadGoods();
});

// ===== 购买/智能体全局函数（onclick 内联调用） =====

function buyGood(id) {
  // 联动逻辑：引导跳小程序购买
  showToastGlobal('长按识别小程序码，在「高明之选PPT」小程序内完成购买');
  // 可选：尝试唤起微信小程序（需在小程序后台配置）
  // window.location.href = 'weixin://dl/business/?...';
  console.log('buy good:', id);
}

function openAgent() {
  showToastGlobal('AI 诊断功能即将上线，请关注小程序「高明之选PPT」');
}

function showToastGlobal(msg) {
  var toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('toast--show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(function () {
    toast.classList.remove('toast--show');
  }, 3000);
}
