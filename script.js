// 雪顶山矿泉网站交互功能

// 错误处理函数
function handleError(error, context) {
    console.error('Error in ' + context + ':', error);
}

// 性能优化：防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
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

document.addEventListener('DOMContentLoaded', function() {
    try {
        // 立即显示所有内容
        ensureImmediateDisplay();
        
        // 滚动时头部导航效果
        function handleScroll() {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // 防抖的滚动处理
        const debouncedScroll = debounce(handleScroll, 10);
        window.addEventListener('scroll', debouncedScroll);
        handleScroll(); // 初始化状态
        
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
        
        // 产品卡片悬停效果增强
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-12px) scale(1.03)';
                this.style.zIndex = '10';
                
                // 添加微妙的发光效果
                this.style.boxShadow = '0 20px 50px rgba(0, 122, 193, 0.25)';
                
                // 图片容器额外效果
                const imageContainer = this.querySelector('.product-image');
                if (imageContainer) {
                    imageContainer.style.transform = 'scale(1.1) rotate(2deg)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.zIndex = '1';
                this.style.boxShadow = '';
                
                // 恢复图片容器效果
                const imageContainer = this.querySelector('.product-image');
                if (imageContainer) {
                    imageContainer.style.transform = '';
                }
            });
        });
        
        // 产品图片点击放大效果
        const productImages = document.querySelectorAll('.product-image');
        productImages.forEach(image => {
            image.addEventListener('click', function() {
                const img = this.querySelector('.product-img');
                if (img) {
                    // 创建放大视图
                    const overlay = document.createElement('div');
                    overlay.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background: rgba(0, 0, 0, 0.8);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        z-index: 1000;
                        cursor: zoom-out;
                        backdrop-filter: blur(10px);
                    `;
                    
                    const enlargedImg = document.createElement('img');
                    enlargedImg.src = img.src;
                    enlargedImg.style.cssText = `
                        max-width: 80%;
                        max-height: 80%;
                        object-fit: contain;
                        border-radius: 20px;
                        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                        animation: zoomIn 0.3s ease;
                    `;
                    
                    overlay.appendChild(enlargedImg);
                    document.body.appendChild(overlay);
                    
                    // 点击关闭
                    overlay.addEventListener('click', function() {
                        this.style.animation = 'zoomOut 0.3s ease';
                        setTimeout(() => {
                            document.body.removeChild(this);
                        }, 300);
                    });
                }
            });
        });
        
        // 按钮点击效果
        const buttons = document.querySelectorAll('.cta-button, .wechat-consult-btn');
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                // 添加点击反馈效果
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);
            });
        });
        
        // 页面加载动画
        function initPageAnimations() {
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.opacity = '0';
                heroContent.style.transform = 'translateY(30px)';
                
                setTimeout(() => {
                    heroContent.style.transition = 'all 0.8s ease';
                    heroContent.style.opacity = '1';
                    heroContent.style.transform = 'translateY(0)';
                }, 200);
            }
        }
        
        initPageAnimations();
        
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
        
        // 页面加载完成后的额外处理
        window.addEventListener('load', function() {
            // 确保所有内容都已加载
            console.log('页面加载完成，所有交互功能已初始化');
        });
        
    } catch (error) {
        handleError(error, 'DOMContentLoaded');
    }
});

// 窗口大小改变时的响应式处理
window.addEventListener('resize', debounce(function() {
    // 在窗口大小改变时，重新计算导航栏高度等
    if (window.innerWidth > 768) {
        // 在大屏幕上确保导航菜单是展开状态
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu) {
            navMenu.classList.remove('active');
        }
    }
}, 250));