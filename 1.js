// 1. Управление кастомным курсором
        const cursor = document.getElementById('custom-cursor');
        const cursorBlur = document.getElementById('custom-cursor-blur');

        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
            
            // Легкая задержка для внешнего круга
            cursorBlur.style.left = e.clientX + 'px';
            cursorBlur.style.top = e.clientY + 'px';
        });

        // Эффект увеличения курсора при наведении на кликабельные объекты
        const interactiveElements = document.querySelectorAll('.card, button, .logo');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.width = '20px';
                cursor.style.height = '20px';
                cursor.style.backgroundColor = 'rgba(255,255,255,0.2)';
                cursorBlur.style.width = '60px';
                cursorBlur.style.height = '60px';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.width = '8px';
                cursor.style.height = '8px';
                cursor.style.backgroundColor = '#ffffff';
                cursorBlur.style.width = '40px';
                cursorBlur.style.height = '40px';
            });
        });

        // 2. Интерактивный блик и 3D Наклон карточек (Физика)
        const cards = document.querySelectorAll('[data-tilt]');
        
        cards.forEach(card => {
            const glow = card.querySelector('.card-glow');
            
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Позиционирование блика
                glow.style.left = x + 'px';
                glow.style.top = y + 'px';

                // Вычисление наклона (3D эффект)
                const width = rect.width;
                const height = rect.height;
                const rotateX = -(y - height / 2) / 10;
                const rotateY = (x - width / 2) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
            });
        });

        // Перемещение блика для карточек без 3D-наклона (чтобы отклик оставался)
        document.querySelectorAll('.card').forEach(card => {
            if(!card.hasAttribute('data-tilt')) {
                const glow = card.querySelector('.card-glow');
                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    glow.style.left = (e.clientX - rect.left) + 'px';
                    glow.style.top = (e.clientY - rect.top) + 'px';
                });
            }
        });

        // 3. ПРИКОЛ 1: Раскрытие блока по клику
        const expandCard = document.getElementById('expandable-card');
        const toggleBtn = document.getElementById('toggle-btn');

        toggleBtn.addEventListener('click', () => {
            expandCard.classList.toggle('expanded');
            if(expandCard.classList.contains('expanded')) {
                toggleBtn.innerText = 'Свернуть блок';
            } else {
                toggleBtn.innerText = 'Развернуть блок';
            }
        });

        // 4. ПРИКОЛ 2: Магнитная кнопка
        const magBtn = document.getElementById('mag-btn');
        const magWrap = magBtn.parentElement;

        magWrap.addEventListener('mousemove', (e) => {
            const rect = magBtn.getBoundingClientRect();
            const x = e.clientX - (rect.left + rect.width / 2);
            const y = e.clientY - (rect.top + rect.height / 2);
            
            // Движение кнопки в сторону курсора на 40% от расстояния
            magBtn.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px)`;
        });

        magWrap.addEventListener('mouseleave', () => {
            magBtn.style.transform = 'translate(0px, 0px)';
        });

        // 5. ПРИКОЛ 3: Эффект печатной машинки для заголовка
        const textEl = document.getElementById('typing-hero');
        const textString = textEl.innerText;
        textEl.innerText = '';
        let index = 0;

        function type() {
            if (index < textString.length) {
                textEl.innerText += textString.charAt(index);
                index++;
                setTimeout(type, 80);
            }
        }
        setTimeout(type, 500);

        // 6. ПРИКОЛ 4: Вывод координат мыши внутри карточки
        const motionCard = document.getElementById('motion-card');
        const coordsDisplay = document.getElementById('coords');

        motionCard.addEventListener('mousemove', (e) => {
            const rect = motionCard.getBoundingClientRect();
            const x = Math.floor(e.clientX - rect.left);
            const y = Math.floor(e.clientY - rect.top);
            coordsDisplay.innerText = `X: ${x} | Y: ${y}`;
            coordsDisplay.style.color = 'var(--text-primary)';
        });

        motionCard.addEventListener('mouseleave', () => {
            coordsDisplay.style.color = 'var(--text-muted)';
        });

        // 7. ПРИКОЛ 5: Интерактивный эквалайзер (изменение высоты по клику)
        const barInputCard = document.getElementById('bar-input').parentElement;
        const bars = document.querySelectorAll('.bar');

        function randomizeBars() {
            bars.forEach(bar => {
                const heightPercent = Math.floor(Math.random() * 75) + 25; // от 25% до 100%
                bar.style.height = heightPercent + '%';
            });
        }

        // Инициализация начальных высот
        randomizeBars();

        // Изменение по клику на карточку
        barInputCard.addEventListener('click', randomizeBars);