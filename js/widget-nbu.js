// Полифилл для метода forEach для NodeList
if (window.NodeList && !NodeList.prototype.forEach) {
	NodeList.prototype.forEach = function (callback, thisArg) {
		thisArg = thisArg || window;
		for (var i = 0; i < this.length; i++) {
			callback.call(thisArg, this[i], i, this);
		}
	};
}

//Объекты с курсами валют
const rates = {};
const ratesNext = {};

//Получаем блок для вставки виджета и создаем элементы
const divWrapper = document.getElementById('widget-nbu'),
      form = document.createElement( "form"),
      title = document.createElement( "h1" ),
      divCourseWrapper = document.createElement( "div" ),
      divСonverterWrapper = document.createElement( "div" );

createWidget();

//Получаем элементы для отображения курса валют и формы
const elementUSD = document.querySelector('[data-value="USD"]'),
      elementEUR = document.querySelector('[data-value="EUR"]'),
      elementRUB = document.querySelector('[data-value="RUB"]'),
      inputForm = document.querySelector('#converter-item-nbu-input'),
      resultForm = document.querySelector('#converter-item-nbu-result'),
      selectSetForm = document.querySelector('#converter-item-nbu-select-set'),
      selectGetForm = document.querySelector('#converter-item-nbu-select-get');

getCurrencies();
setInterval(getCurrencies, 60000);

function createWidget(){
    title.textContent = "Курс валют в НБУ";

    divCourseWrapper.innerHTML = `<div class="course-item-nbu">
                                    <div class="course-item-nbu-title">Курс USD</div>
                                    <div class="course-item-nbu-value" data-value="USD">--:--</div>
                                </div>
                                <div class="course-item-nbu">
                                    <div class="course-item-nbu-title">Курс EUR</div>
                                    <div class="course-item-nbu-value" data-value="EUR">--:--</div>
                                </div>
                                <div class="course-item-nbu">
                                    <div class="course-item-nbu-title">Курс RUB</div>
                                    <div class="course-item-nbu-value" data-value="RUB">--:--</div>
                                </div>`;

    divСonverterWrapper.innerHTML = `<div class="converter-item-nbu">
                                        <label class="converter-item-nbu-label" for="name">Отдаю:</label>
                                        <div class="dropdown-nbu">
                                            <button class="dropdown-nbu-button">UAH — Гривна</button>
                                            <ul class="dropdown-nbu-list">
                                                <li class="dropdown-nbu-list-item" data-value="USD">USD — Доллар США</li>
                                                <li class="dropdown-nbu-list-item" data-value="EUR">EUR — Евро</li>
                                                <li class="dropdown-nbu-list-item" data-value="RUB">RUB — Рубль</li>
                                                <li class="dropdown-nbu-list-item"data-value="UAH">UAH — Гривна</li>
                                            </ul>
                                            <input type="text" id="converter-item-nbu-select-set" name="select-input-nbu" value="UAH" class="input-nbu-hidden">
                                        </div>
                                        <input id="converter-item-nbu-input" type="number" class="converter-nbu-form-control" autofocus/>
                                    </div>
                                    <div class="converter-item-nbu">
                                        <label class="converter-item-nbu-label" for="name">Получаю:</label>
                                        <div class="dropdown-nbu">
                                            <button class="dropdown-nbu-button">UAH — Гривна</button>
                                            <ul class="dropdown-nbu-list">
                                                <li class="dropdown-nbu-list-item" data-value="USD">USD — Доллар США</li>
                                                <li class="dropdown-nbu-list-item" data-value="EUR">EUR — Евро</li>
                                                <li class="dropdown-nbu-list-item" data-value="RUB">RUB — Рубль</li>
                                                <li class="dropdown-nbu-list-item"data-value="UAH">UAH — Гривна</li>
                                            </ul>
                                            <input type="text" id="converter-item-nbu-select-get" name="select-input-nbu" value="UAH" class="input-nbu-hidden">
                                        </div>
                                        <input id="converter-item-nbu-result" type="number" class="converter-nbu-form-control"/>
                                    </div>`;

    //Добавляем классы к контейнерам
    form.classList.add('wrapper-nbu-form');
    title.classList.add('wrapper-nbu-title');
    divCourseWrapper.classList.add('wrapper-course-nbu');
    divСonverterWrapper.classList.add('wrapper-converter-nbu');   

    //Вставляем элементы в виджет
    divWrapper.append(form);
    form.append(title);
    form.append(divCourseWrapper);
    form.append(divСonverterWrapper);
}

//Функция получения курсов валют
async function getCurrencies (){
    const past = new Date();
    let day = past.getDate();
    let month = past.getMonth()+1;
    let year = past.getFullYear();
    if (day == 1){
        if (month == 1) {year -= 1;}
        else {month -=1;}
    }
    else {day -= 1;}

    const strPastDate = year.toString()+month.toString().replace(/^(\d)$/, "0$1")+day.toString();
    const response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date='+strPastDate+'&json');
    const data = await response.json();
    const result = await data;
    rates.USD = result[26].rate;
    rates.EUR = result[33].rate;
    rates.RUB = result[18].rate;
    rates.UAH = 1;
    rates.DATE = result[18].exchangedate;

    const now = new Date();
    const strDate = now.getFullYear().toString()+(now.getMonth()+1).toString().replace(/^(\d)$/, "0$1")+(now.getDate()).toString();
    const responseNext = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date='+strDate+'&json');
    const dataNext = await responseNext.json();
    const resultNext = await dataNext;
    ratesNext.USD = resultNext[26].rate;
    ratesNext.EUR = resultNext[33].rate;
    ratesNext.RUB = resultNext[18].rate;
    ratesNext.UAH = 1;
    ratesNext.DATE = resultNext[18].exchangedate;

    setCourseItemValue();
}


//Функция отображения курса на странице
function setCourseItemValue(){

    title.textContent = "Курс валют в НБУ на "+ratesNext.DATE;

    elementUSD.textContent = ratesNext.USD.toFixed(2);
    elementEUR.textContent = ratesNext.EUR.toFixed(2);
    elementRUB.textContent = ratesNext.RUB.toFixed(2);

    //Если подорожал, то выделяем красным, если подешевел, то зеленым
    //Цвет для информера USD
    if (rates.USD < ratesNext.USD){
        elementUSD.classList.add('top');
        elementUSD.classList.remove('bottom');
    }
    else if (rates.USD > ratesNext.USD){
        elementUSD.classList.add('bottom');
        elementUSD.classList.remove('top');
    }
    else {
        elementUSD.classList.remove('top');
        elementUSD.classList.remove('bottom');
    }

    //Цвет для информера EUR
    if (rates.EUR < ratesNext.EUR){
        elementEUR.classList.add('top');
        elementEUR.classList.remove('bottom');
    }
    else if (rates.EUR > ratesNext.EUR){
        elementEUR.classList.add('bottom');
        elementEUR.classList.remove('top');
    }
    else {
        elementEUR.classList.remove('top');
        elementEUR.classList.remove('bottom');
    }
    
    //Цвет для информера RUB
    if (rates.RUB < ratesNext.RUB){
        elementRUB.classList.add('top');
        elementRUB.classList.remove('bottom');
    }
    else if (rates.RUB > ratesNext.RUB){
        elementRUB.classList.add('bottom');
        elementRUB.classList.remove('top');
    }
    else {
        elementRUB.classList.remove('top');
        elementRUB.classList.remove('bottom');
    }
}

//Случаем изменения в текстовом поле
inputForm.oninput = function () {
    convertValue();
};

//Функция конвертации
function convertValue() {
    if (isNaN(parseFloat(inputForm.value))){
        resultForm.value = (1 * ratesNext[selectSetForm.value] / ratesNext[selectGetForm.value]).toFixed(2);
        inputForm.value = 1;
    }
    else {
        resultForm.value = (parseFloat(inputForm.value) * ratesNext[selectSetForm.value] / ratesNext[selectGetForm.value]).toFixed(2);
    }
}

//Работа с имитацией select
document.querySelectorAll('.dropdown-nbu').forEach(function (dropDownWrapper) {
    const dropDownBtn = dropDownWrapper.querySelector('.dropdown-nbu-button'),
          dropDownList = dropDownWrapper.querySelector('.dropdown-nbu-list'),
          dropDownListItems = dropDownWrapper.querySelectorAll('.dropdown-nbu-list-item');

    // Клик по кнопке. Открыть/закрыть select
    dropDownBtn.addEventListener('click', function (e) {
        dropDownList.classList.toggle('dropdown-nbu-list-visible');
        dropDownBtn.classList.toggle('dropdown-nbu-button-triangle');
        e.preventDefault();
    });

    // Выбор элемента списка. Запомнить выбранное значение. Закрыть дропдаун
    dropDownListItems.forEach(function (listitem) {
        listitem.addEventListener('click', function (e) {
            e.stopPropagation();
            dropDownBtn.innerText = this.innerText;
            dropDownWrapper.querySelector('.input-nbu-hidden').value = this.dataset.value;
            dropDownList.classList.remove('dropdown-nbu-list-visible');
            dropDownBtn.classList.remove('dropdown-nbu-button-triangle');
            convertValue();
        });
    });

    // Клик снаружи дропдауна. Закрыть дропдаун
    document.addEventListener('click', function (e) {
        if (e.target !== dropDownBtn) {
            dropDownList.classList.remove('dropdown-nbu-list-visible');
            dropDownBtn.classList.remove('dropdown-nbu-button-triangle');
        }
    });

    // Нажатие на Tab или EScape. Закрыть дропдаун 
    document.addEventListener('keydown', function (e) {
        if ( e.key === 'Tab' || e.key === 'Escape' ) {
            dropDownList.classList.remove('dropdown-nbu-list-visible');
            dropDownBtn.classList.remove('dropdown-nbu-button-triangle');
        }
    });
});