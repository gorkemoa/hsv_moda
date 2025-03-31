document.addEventListener('DOMContentLoaded', function() {
    // Resim galerisi fonksiyonları
    const mainImage = document.getElementById('current');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Thumbnail resimlerini ana resimde göster
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Aktif thumbnailin class'ını değiştir
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                this.classList.add('active');
                
                // Ana resmi güncelle
                const imgSrc = this.querySelector('img').getAttribute('src');
                mainImage.setAttribute('src', imgSrc);
                
                // Ana resmi büyüt efekti
                mainImage.classList.add('zoom');
                setTimeout(() => {
                    mainImage.classList.remove('zoom');
                }, 300);
            });
        });
    }
    
    // Renk seçimi
    const colorOptions = document.querySelectorAll('.color-option');
    const selectedColorText = document.querySelector('.selected-color');
    
    if (colorOptions.length > 0 && selectedColorText) {
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Aktif renk seçeneğini güncelle
                colorOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                
                // Seçilen renk metnini güncelle
                const colorName = this.getAttribute('data-color');
                selectedColorText.textContent = colorName;
            });
        });
    }
    
    // Beden seçimi
    const sizeOptions = document.querySelectorAll('.size-option');
    
    if (sizeOptions.length > 0) {
        sizeOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Aktif beden seçeneğini güncelle
                sizeOptions.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
    }
    
    // Detay sekmeleri
    const tabButtons = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Aktif sekmeyi güncelle
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Aktif içeriği göster
                const tabId = this.getAttribute('data-tab');
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
    
    // Favorilere ekle butonu
    const wishlistButton = document.querySelector('.add-to-wishlist');
    
    if (wishlistButton) {
        wishlistButton.addEventListener('click', function() {
            const heartIcon = this.querySelector('i');
            
            if (heartIcon.classList.contains('far')) {
                // Favorilere ekle
                heartIcon.classList.remove('far');
                heartIcon.classList.add('fas');
                showNotification('Ürün favorilerinize eklendi', 'success');
            } else {
                // Favorilerden çıkar
                heartIcon.classList.remove('fas');
                heartIcon.classList.add('far');
                showNotification('Ürün favorilerinizden çıkarıldı', 'info');
            }
        });
    }
    
    // Sepete ekle butonu
    const addToBagButton = document.querySelector('.add-to-bag');
    
    if (addToBagButton) {
        addToBagButton.addEventListener('click', function() {
            // Seçili beden kontrolü
            const selectedSize = document.querySelector('.size-option.selected');
            
            if (!selectedSize) {
                showNotification('Lütfen bir beden seçiniz', 'error');
                return;
            }
            
            // Sepete ekle işlemi
            showNotification('Ürün sepetinize eklendi', 'success');
            
            // Sepet ikonuna animasyon
            const bagIcon = document.querySelector('.bag-link i');
            if (bagIcon) {
                bagIcon.classList.add('animate-bag');
                setTimeout(() => {
                    bagIcon.classList.remove('animate-bag');
                }, 1000);
            }
        });
    }
    
    // Ürün Galerisi İşlevleri
    initProductGallery();
    
    // Sayfa yüklendiğinde CSS animasyonları ekle
    const style = document.createElement('style');
    style.textContent = `
        .main-image img.zoom {
            transform: scale(1.05);
            transition: transform 0.3s ease;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateY(0); }
            25% { transform: translateY(-5px); }
            75% { transform: translateY(-3px); }
        }
        
        .animate-bag {
            animation: shake 0.5s ease-in-out;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: white;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            transform: translateX(120%);
            transition: transform 0.3s ease;
            z-index: 9999;
            min-width: 300px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
        }
        
        .notification-content i {
            margin-right: 10px;
            font-size: 18px;
        }
        
        .notification.success {
            border-left: 4px solid #4CAF50;
        }
        
        .notification.success i {
            color: #4CAF50;
        }
        
        .notification.error {
            border-left: 4px solid #F44336;
        }
        
        .notification.error i {
            color: #F44336;
        }
        
        .notification.info {
            border-left: 4px solid #2196F3;
        }
        
        .notification.info i {
            color: #2196F3;
        }
        
        .close-notification {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            color: #999;
            transition: color 0.3s;
        }
        
        .close-notification:hover {
            color: #333;
        }
    `;
    
    document.head.appendChild(style);
});

function initProductGallery() {
    const galleryMain = document.querySelector('.gallery-main');
    if (!galleryMain) return; // Eğer galeri yoksa işlem yapma
    
    const galleryImages = document.querySelectorAll('.gallery-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    const prevButton = document.querySelector('.gallery-prev');
    const nextButton = document.querySelector('.gallery-next');
    
    let currentIndex = 0;
    
    // Thumbnail tıklama işlevleri
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            setActiveImage(index);
        });
    });
    
    // İleri-geri butonları
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
            setActiveImage(currentIndex);
        });
        
        nextButton.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % galleryImages.length;
            setActiveImage(currentIndex);
        });
    }
    
    // Aktif görüntüyü ayarlama fonksiyonu
    function setActiveImage(index) {
        galleryImages.forEach(img => img.classList.remove('active'));
        thumbnails.forEach(thumb => thumb.classList.remove('active'));
        
        galleryImages[index].classList.add('active');
        thumbnails[index].classList.add('active');
        currentIndex = index;
    }
}

// Bildirim gösterme fonksiyonu
function showNotification(message, type) {
    // Eğer daha önce bildirim varsa kaldır
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Yeni bildirim oluştur
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="close-notification"><i class="fas fa-times"></i></button>
    `;
    
    // Bildirimi sayfaya ekle
    document.body.appendChild(notification);
    
    // Bildirimi göster
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Bildirim kapatma düğmesi
    const closeButton = notification.querySelector('.close-notification');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
    }
    
    // Belirli bir süre sonra otomatik kapat
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
} 