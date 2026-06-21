/*
  도넛 픽 (Donut Pick) - JavaScript logic
  쇼핑 서비스의 핵심인 '데이터 관리'와 '동적 화면 렌더링', '필터링' 기능을 구현합니다.
  대학 1학년 초보자 분들이 쉽게 이해할 수 있도록 세부 코드마다 주석을 꼼꼼히 작성했습니다.
*/

// 1. 도넛 상품 데이터 정의 (배열과 객체 활용)
// 쇼핑몰의 상품 목록은 보통 서버에서 받아오지만, 여기서는 학습을 위해 자바스크립트 배열(List)로 직접 준비합니다.
// 각 도넛은 [이름, 가격, 카테고리, 이미지 URL] 정보를 가집니다.
const donutData = [
    {
        name: "클래식 글레이즈드",
        price: 1800,
        category: "classic", // 기본 카테고리
        image: "images/classic.png"
    },
    {
        name: "초코 스프링클 도넛",
        price: 2500,
        category: "choco", // 초코 카테고리
        image: "images/choco.png"
    },
    {
        name: "초코 달콤 더블 링",
        price: 2800,
        category: "choco",
        image: "images/choco.png" // 준비된 초코 이미지를 재사용
    },
    {
        name: "딸기 핑크 퐁당 도넛",
        price: 2600,
        category: "strawberry", // 딸기 카테고리
        image: "images/strawberry.png"
    },
    {
        name: "딸기 슈크림 가득 도넛",
        price: 3000,
        category: "strawberry",
        image: "images/strawberry.png"
    },
    {
        name: "클래식 단팥 도넛",
        price: 2000,
        category: "classic",
        image: "images/classic.png"
    }
];

// 2. HTML 요소 선택하기
// 자바스크립트가 HTML의 특정 영역을 제어할 수 있도록 DOM 요소를 가져옵니다.
const donutListContainer = document.getElementById("donut-list");
const categoryButtons = document.querySelectorAll(".category-btn");

// [2단계 추가] 장바구니 영역 제어를 위한 DOM 요소 선택
const cartListContainer = document.getElementById("cart-list");
const cartTotalPriceElement = document.getElementById("cart-total-price");

// [3단계 추가] 주문 입력 폼 제어를 위한 DOM 요소 선택
const orderNameInput = document.getElementById("order-name");
const orderPhoneInput = document.getElementById("order-phone");
const submitOrderBtn = document.getElementById("submit-order-btn");

// 3. 장바구니 상태(State) 데이터 정의
// 현재 장바구니에 담긴 상품 목록을 관리할 배열입니다.
// 장바구니에 담기는 각 도넛은 { name, price, image, quantity(수량) } 구조를 가집니다.
let cart = [];

// 4. 화면에 도넛 목록을 그리는(렌더링) 함수 정의
function renderDonuts(donutsToRender) {
    // 기존에 진열대에 있던 도넛들을 모두 지웁니다.
    donutListContainer.innerHTML = "";

    if (donutsToRender.length === 0) {
        donutListContainer.innerHTML = `<p class="no-item-msg">현재 선택하신 카테고리의 도넛 준비 중입니다. 🍩</p>`;
        return;
    }

    donutsToRender.forEach(function(donut) {
        const card = document.createElement("div");
        card.className = "donut-card";

        card.innerHTML = `
            <img src="${donut.image}" alt="${donut.name}">
            <div>
                <span class="category">${getCategoryKorean(donut.category)}</span>
                <h3>${donut.name}</h3>
            </div>
            <div>
                <p class="price">${donut.price.toLocaleString()}원</p>
                <!-- [담기] 버튼을 누르면 해당 도넛의 이름을 addToCart 함수에 인자로 넘겨 호출합니다. -->
                <button class="pick-btn" onclick="addToCart('${donut.name}')">담기</button>
            </div>
        `;

        donutListContainer.appendChild(card);
    });
}

// 카테고리 영문명을 한국어로 변환해주는 도우미 함수
function getCategoryKorean(category) {
    switch(category) {
        case "classic": return "기본 도넛";
        case "choco": return "초코 도넛";
        case "strawberry": return "딸기 도넛";
        default: return "도넛";
    }
}

// 5. 장바구니 담기 함수 (중복 체크 논리 포함)
function addToCart(donutName) {
    // (1) 전체 도넛 데이터(donutData)에서 클릭한 도넛의 상세 정보 객체를 찾습니다.
    const selectedDonut = donutData.find(function(donut) {
        return donut.name === donutName;
    });

    // (2) 이미 장바구니(cart)에 이 도넛이 들어가 있는지 검사합니다.
    const existDonut = cart.find(function(item) {
        return item.name === donutName;
    });

    if (existDonut) {
        // [중복 시 처리] 이미 장바구니에 있다면 수량(quantity)만 1 증가시킵니다.
        existDonut.quantity += 1;
    } else {
        // [새 도넛인 경우] 장바구니에 새로 추가하되, 수량(quantity) 속성을 1로 세팅하여 push합니다.
        cart.push({
            name: selectedDonut.name,
            price: selectedDonut.price,
            image: selectedDonut.image,
            quantity: 1
        });
    }

    // (3) 장바구니 배열의 데이터가 변했으므로, 화면에 보이는 장바구니 목록도 다시 그려줍니다.
    renderCart();
}

// 6. 장바구니 수량 조절 함수 ([+] / [-] 버튼 대응)
// change 매개변수에는 1(수량 증가) 또는 -1(수량 감소)이 들어옵니다.
function updateQuantity(donutName, change) {
    // 장바구니에서 해당 도넛을 찾습니다.
    const targetItem = cart.find(function(item) {
        return item.name === donutName;
    });

    if (targetItem) {
        // 수량이 줄어들 때 1 미만(0 이하)이 되는 것을 방지하는 방어 코드
        if (change === -1 && targetItem.quantity <= 1) {
            alert("최소 수량은 1개입니다. 더 이상 줄일 수 없어요! 🍩");
            return; // 함수를 여기서 즉시 종료하여 수량이 내려가지 않게 막음
        }

        // 수량 증가 혹은 감소 처리
        targetItem.quantity += change;
        
        // 화면 갱신
        renderCart();
    }
}

// 7. 장바구니 항목 삭제 함수 (🗑️ 버튼 대응)
function removeFromCart(donutName) {
    // filter 메서드를 사용해, 클릭한 도넛을 제외한 나머지 아이템들로만 새 장바구니 배열을 구성합니다.
    cart = cart.filter(function(item) {
        return item.name !== donutName;
    });

    // 화면 갱신
    renderCart();
}

// 8. 장바구니 화면 그리기 및 실시간 합계 계산 함수
function renderCart() {
    // (1) 장바구니 목록 컨테이너 초기화
    cartListContainer.innerHTML = "";

    // (2) 만약 장바구니에 아무것도 담겨있지 않다면, 안내 메시지를 표시하고 합계를 0원으로 만듭니다.
    if (cart.length === 0) {
        cartListContainer.innerHTML = `
            <p class="cart-empty-msg">장바구니가 비어 있습니다.<br>맛있는 도넛을 담아보세요! 🍩</p>
        `;
        cartTotalPriceElement.textContent = "0";

        // [3단계 추가] 장바구니가 비어 있을 때는 주문 정보를 입력할 수 없도록 폼을 비활성화합니다.
        toggleOrderForm(true);
        return;
    }

    // [3단계 추가] 장바구니에 상품이 담기면 주문 정보를 입력할 수 있도록 활성화합니다.
    toggleOrderForm(false);

    // (3) 실시간 최종 합계 금액을 누적할 변수 선언
    let totalPrice = 0;

    // (4) 장바구니 배열을 순회하며 요소를 그려줍니다.
    cart.forEach(function(item) {
        // 해당 아이템의 (단가 * 수량)을 계산해 누적 합계에 더해줍니다.
        const itemTotalPrice = item.price * item.quantity;
        totalPrice += itemTotalPrice;

        // 개별 장바구니 아이템 박스(div) 생성
        const cartItemDiv = document.createElement("div");
        cartItemDiv.className = "cart-item";

        cartItemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">${(item.price * item.quantity).toLocaleString()}원</p>
            </div>
            <!-- 수량 조절 버튼 영역 -->
            <div class="cart-quantity-control">
                <!-- [-] 버튼: 클릭 시 updateQuantity(이름, -1) 호출 -->
                <button class="qty-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                <span class="qty-val">${item.quantity}</span>
                <!-- [+] 버튼: 클릭 시 updateQuantity(이름, 1) 호출 -->
                <button class="qty-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
            </div>
            <!-- 삭제 버튼: 클릭 시 removeFromCart(이름) 호출 -->
            <button class="cart-remove-btn" onclick="removeFromCart('${item.name}')">🗑️</button>
        `;

        cartListContainer.appendChild(cartItemDiv);
    });

    // (5) 계산 완료된 최종 합계 금액을 세 자리 콤마 포맷으로 렌더링합니다.
    cartTotalPriceElement.textContent = totalPrice.toLocaleString();
}

// [3단계 추가] 주문 폼 활성화/비활성화 제어 도우미 함수
function toggleOrderForm(isDisabled) {
    orderNameInput.disabled = isDisabled;
    orderPhoneInput.disabled = isDisabled;
    submitOrderBtn.disabled = isDisabled;
    
    if (isDisabled) {
        // 비활성화될 때 기존 입력값도 깨끗이 비워줍니다.
        orderNameInput.value = "";
        orderPhoneInput.value = "";
    }
}

// [3단계 추가] 가상 주문 완료 및 유효성 검사 함수
function submitOrder() {
    // 장바구니가 실제로 비어있는지 다시 한 번 체크 (방어적 프로그래밍)
    if (cart.length === 0) {
        alert("장바구니가 비어 있습니다. 도넛을 먼저 담아주세요! 🍩");
        return;
    }

    // 입력 필드에서 값 가져오기 및 앞뒤 불필요한 공백 제거(.trim())
    const userName = orderNameInput.value.trim();
    const userPhone = orderPhoneInput.value.trim();

    // 1. 이름 유효성 검사
    if (userName === "") {
        alert("정보를 입력해 주세요. (주문자 이름을 채워주세요! ✍️)");
        orderNameInput.focus(); // 입력창으로 포커스 이동
        return;
    }

    // 2. 연락처 유효성 검사
    if (userPhone === "") {
        alert("정보를 입력해 주세요. (연락처를 채워주세요! 📞)");
        orderPhoneInput.focus();
        return;
    }

    // 하이픈(-)을 모두 제거한 순수 숫자 길이를 기준으로 최소 9자리 이상 체크합니다.
    // (예: 서울 지역번호 포함 전화번호인 '02-123-4567'은 9자리입니다.)
    const purePhoneDigits = userPhone.replace(/-/g, ""); // 정규표현식으로 하이픈 제거
    if (purePhoneDigits.length < 9) {
        alert("연락처를 올바르게 입력해 주세요. (하이픈 제외 최소 9자리 이상! 📱)");
        orderPhoneInput.focus();
        return;
    }

    // 3. 유효성 검사를 통과했을 때 주문 접수 완료 처리
    // 예쁜 알림창(alert)으로 성공 메시지 표시
    alert(`🎉 주문 접수 완료! 🎉\n\n${userName}님의 달콤한 도넛 주문이 성공적으로 접수되었습니다.\n맛있게 구워드릴게요! 🍩✨`);

    // 4. 장바구니 및 입력 폼 초기화 (데이터 초기 상태 복원)
    cart = []; // 장바구니 배열 비우기
    orderNameInput.value = ""; // 입력창 비우기
    orderPhoneInput.value = ""; // 입력창 비우기
    
    // 화면에 반영
    renderCart();
}

// 9. 카테고리 필터링 처리 함수 (1단계 코드 유지)
categoryButtons.forEach(function(button) {
    button.addEventListener("click", function(event) {
        categoryButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        event.currentTarget.classList.add("active");
        const selectedCategory = event.currentTarget.getAttribute("data-category");

        if (selectedCategory === "all") {
            renderDonuts(donutData);
        } else {
            const filteredDonuts = donutData.filter(function(donut) {
                return donut.category === selectedCategory;
            });
            renderDonuts(filteredDonuts);
        }
    });
});

// 10. 페이지 로드 초기화
document.addEventListener("DOMContentLoaded", function() {
    renderDonuts(donutData);
    renderCart(); // 장바구니도 초기 상태(비어있음)로 렌더링
});
