// 雪顶山矿泉网站交互功能

document.addEventListener('DOMContentLoaded', function() {
    // 立即显示所有内容
    ensureImmediateDisplay();
    
    // 导航菜单切换
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // 汉堡菜单动画
            const spans = navToggle.querySelectorAll('span');
            spans.forEach(span => span.classList.toggle('active'));
        });
    }

// 确保内容立即显示
function ensureImmediateDisplay() {
    // 移除所有图片的懒加载属性
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.removeAttribute('loading');
        img.classList.add('image-loaded');
    });
    
    // 确保页面内容立即可见
    const contentElements = document.querySelectorAll('.handbook-section, .contact-content');
    contentElements.forEach(element => {
        element.style.opacity = '1';
        element.style.visibility = 'visible';
    });
}
}
    
    // 平滑滚动 - 只处理页面内锚点链接
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // 如果是页面内锚点链接（以#开头），则进行平滑滚动处理
            if (targetId.startsWith('#')) {
                e.preventDefault();
                
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // 关闭移动端菜单
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                    }
                    
                    // 计算偏移量（考虑固定导航栏）
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
            // 如果是外部页面链接（如about.html），则允许正常跳转
            // 为了确保谷歌浏览器兼容性，明确不阻止默认行为
            else if (targetId.includes('.html') || targetId.includes('http')) {
                // 允许正常跳转，不阻止默认行为
                // 可以添加一些额外的处理，比如关闭移动端菜单
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
                
                // 为了确保兼容性，明确允许默认行为
                // 不调用e.preventDefault()
            }
        });
    });
    
    // 额外的安全措施：确保所有外部链接都能正常工作
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        if (target && (target.href.includes('.html') || target.href.includes('http'))) {
            // 确保外部链接能正常跳转
            // 不阻止默认行为
        }
    });

    // 厂区图片切换功能
    const factoryThumbs = document.querySelectorAll('.factory-thumb');
    const mainImg = document.querySelector('.main-img');
    
    if (factoryThumbs.length > 0 && mainImg) {
        factoryThumbs.forEach((thumb, index) => {
            thumb.addEventListener('click', function() {
                // 切换主图
                const newSrc = this.src;
                const newAlt = this.alt;
                
                mainImg.src = newSrc;
                mainImg.alt = newAlt;
                
                // 更新缩略图状态
                factoryThumbs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
            
            // 默认激活第一张缩略图
            if (index === 0) {
                thumb.classList.add('active');
            }
        });
    }
    
    // CTA按钮点击事件
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            const productsSection = document.querySelector('#products');
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = productsSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }
    
    // 表单提交处理
    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const phone = this.querySelector('input[type="tel"]').value;
            const message = this.querySelector('textarea').value;
            
            // 简单的表单验证
            if (!name || !phone || !message) {
                alert('请填写所有必填字段');
                return;
            }
            
            // 真实表单提交到后端
            fetch('/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, phone, message })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('感谢您的留言！我们会尽快与您联系。');
                    this.reset();
                } else {
                    alert('提交失败，请稍后重试');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('网络错误，请检查网络连接');
            });
        });
    }
    
    // 滚动动画效果
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 为需要动画的元素添加观察
    const animatedElements = document.querySelectorAll('.about-content, .product-card, .feature, .contact-content');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // 导航栏滚动效果
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // 向下滚动
            header.style.transform = 'translateY(-100%)';
        } else {
            // 向上滚动
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
        
        // 导航栏背景变化
        if (scrollTop > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 20px rgba(0, 119, 182, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 4px 6px rgba(0, 119, 182, 0.1)';
        }
    });
    
    // 产品卡片悬停效果增强
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // 水波动画效果
    function createWaterRipple() {
        const waterBottle = document.querySelector('.water-bottle');
        if (!waterBottle) return;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 10px;
            height: 10px;
            background: rgba(0, 180, 216, 0.6);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            animation: ripple 2s infinite;
        `;
        
        waterBottle.appendChild(ripple);
        
        // 添加CSS动画
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    0% {
                        transform: translate(-50%, -50%) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: translate(-50%, -50%) scale(20);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // 3秒后移除涟漪
        setTimeout(() => {
            ripple.remove();
        }, 2000);
    }
    
    // 每5秒创建一个涟漪
    setInterval(createWaterRipple, 5000);
    
    // 页面加载后立即创建一个涟漪
    setTimeout(createWaterRipple, 1000);
});

// 邮箱验证函数
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 页面加载完成后的初始化
window.addEventListener('load', function() {
    // 添加加载完成类用于动画
    document.body.classList.add('loaded');
    
    // 初始化滚动位置
    window.scrollTo(0, 0);
});