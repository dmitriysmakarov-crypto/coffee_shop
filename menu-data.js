/* Demonstration menu. Replace recipes and prices with confirmed café data before publishing. */
window.FOX_MENU = {
  "categories": {
    "coffee": [
      {
        "id": "milk",
        "name": "С молоком"
      },
      {
        "id": "black",
        "name": "Чёрный"
      },
      {
        "id": "special",
        "name": "Особенные"
      }
    ],
    "desserts": [
      {
        "id": "bakery",
        "name": "Выпечка"
      },
      {
        "id": "cakes",
        "name": "Десерты"
      }
    ]
  },
  "products": {
    "coffee": [
      {
        "id": "cappuccino",
        "name": "Капучино",
        "category": "milk",
        "price": 290,
        "size": "200 мл",
        "tagline": "Мягкий и сливочный",
        "description": "Эспрессо и молоко под плотной мелкой пеной. Нежный вкус с хорошо ощутимым кофе.",
        "ingredients": "Эспрессо, молоко.",
        "allergens": "Молоко.",
        "pair": "croissant",
        "badge": "Классика",
        "image": "./assets/v2/cappuccino.webp",
        "alt": "Капучино: один продукт крупным планом на светлом столе в кофейне Fox Coffee"
      },
      {
        "id": "latte",
        "name": "Латте",
        "category": "milk",
        "price": 320,
        "size": "300 мл",
        "tagline": "Больше молока, больше нежности",
        "description": "Эспрессо в большой порции молока с тонким слоем пены. Для тех, кто любит мягкий кофейный вкус.",
        "ingredients": "Эспрессо, молоко.",
        "allergens": "Молоко.",
        "pair": "cinnamon-roll",
        "badge": "",
        "image": "./assets/v2/latte.webp",
        "alt": "Латте: один продукт крупным планом на светлом столе в кофейне Fox Coffee"
      },
      {
        "id": "flat-white",
        "name": "Флэт уайт",
        "category": "milk",
        "price": 310,
        "size": "180 мл",
        "tagline": "Выразительный кофейный вкус",
        "description": "Двойной эспрессо и немного молока с тонкой микропеной. Кофе звучит ярче, чем в капучино.",
        "ingredients": "Двойной эспрессо, молоко.",
        "allergens": "Молоко.",
        "pair": "almond-croissant",
        "badge": "",
        "image": "./assets/v2/flat-white.webp",
        "alt": "Флэт уайт: один продукт крупным планом на светлом столе в кофейне Fox Coffee"
      },
      {
        "id": "espresso",
        "name": "Эспрессо",
        "category": "black",
        "price": 190,
        "size": "30 мл",
        "tagline": "Насыщенный и короткий",
        "description": "Небольшая чашка концентрированного кофе с золотистой крема. Чистый вкус без молока и сахара.",
        "ingredients": "Кофе, вода.",
        "allergens": "Без молока в рецепте.",
        "pair": "chocolate-cake",
        "badge": "",
        "image": "./assets/v2/espresso.webp",
        "alt": "Эспрессо: один продукт крупным планом на светлом столе в кофейне Fox Coffee"
      },
      {
        "id": "americano",
        "name": "Американо",
        "category": "black",
        "price": 230,
        "size": "200 мл",
        "tagline": "Чёрный кофе без спешки",
        "description": "Эспрессо с горячей водой. Знакомый кофейный вкус в чашке, которую приятно пить подольше.",
        "ingredients": "Эспрессо, горячая вода.",
        "allergens": "Без молока в рецепте.",
        "pair": "cheesecake",
        "badge": "",
        "image": "./assets/v2/americano.webp",
        "alt": "Американо: один продукт крупным планом на светлом столе в кофейне Fox Coffee"
      },
      {
        "id": "filter",
        "name": "Фильтр-кофе",
        "category": "black",
        "price": 250,
        "size": "250 мл",
        "tagline": "Лёгкий и ароматный",
        "description": "Кофе, заваренный через бумажный фильтр. Прозрачный вкус и мягкое послевкусие.",
        "ingredients": "Молотый кофе, вода.",
        "allergens": "Без молока в рецепте.",
        "pair": "carrot-cake",
        "badge": "",
        "image": "./assets/v2/filter.webp",
        "alt": "Фильтр-кофе: один продукт крупным планом на светлом столе в кофейне Fox Coffee"
      },
      {
        "id": "fox-raf",
        "name": "Лисий раф",
        "category": "special",
        "price": 390,
        "size": "250 мл",
        "tagline": "Ваниль · апельсин · сливки",
        "description": "Наш вариант уютного рафа: эспрессо, сливки и ваниль с тонкой апельсиновой нотой.",
        "ingredients": "Эспрессо, сливки, ванильный сахар, апельсиновая цедра.",
        "allergens": "Молоко.",
        "pair": "almond-croissant",
        "badge": "Фирменный",
        "image": "./assets/v2/fox-raf.webp",
        "alt": "Лисий раф: один продукт крупным планом на светлом столе в кофейне Fox Coffee"
      },
      {
        "id": "iced-latte",
        "name": "Айс-латте",
        "category": "special",
        "price": 320,
        "size": "300 мл",
        "tagline": "Прохладный и молочный",
        "description": "Эспрессо, прохладное молоко и лёд. Освежающий выбор для прогулки или неспешного разговора.",
        "ingredients": "Эспрессо, молоко, лёд.",
        "allergens": "Молоко.",
        "pair": "carrot-cake",
        "badge": "Со льдом",
        "image": "./assets/v2/iced-latte.webp",
        "alt": "Айс-латте: один продукт крупным планом на светлом столе в кофейне Fox Coffee"
      },
      {
        "id": "spiced-latte",
        "name": "Пряный латте",
        "category": "special",
        "price": 370,
        "size": "250 мл",
        "tagline": "Корица · кардамон · ваниль",
        "description": "Тёплый латте с корицей, кардамоном и ванилью. Согревающий аромат для прохладного дня.",
        "ingredients": "Эспрессо, молоко, ванильный сироп, корица, кардамон, бадьян.",
        "allergens": "Молоко.",
        "pair": "cinnamon-roll",
        "badge": "Сезонный",
        "image": "./assets/v2/spiced-latte.webp",
        "alt": "Пряный латте: один продукт крупным планом на светлом столе в кофейне Fox Coffee"
      }
    ],
    "desserts": [
      {
        "id": "croissant",
        "name": "Круассан",
        "category": "bakery",
        "price": 240,
        "size": "80 г",
        "tagline": "Сливочный и хрустящий",
        "description": "Тонкие золотистые слои и мягкая сердцевина. Классическая пара к утреннему капучино.",
        "ingredients": "Пшеничная мука, сливочное масло, молоко, дрожжи, сахар, яйцо, соль.",
        "allergens": "Глютен, молоко, яйцо.",
        "pair": "cappuccino",
        "badge": "Классика",
        "image": "./assets/v2/croissant.webp",
        "alt": "Круассан: один продукт крупным планом на светлом столе в кофейне Fox Coffee"
      },
      {
        "id": "almond-croissant",
        "name": "Миндальный круассан",
        "category": "bakery",
        "price": 320,
        "size": "110 г",
        "tagline": "Миндальный крем и лепестки",
        "description": "Хрустящий круассан с миндальным кремом, лепестками миндаля и лёгкой сахарной пудрой.",
        "ingredients": "Круассан, миндаль, сливочное масло, сахар, яйцо.",
        "allergens": "Глютен, молоко, яйцо, миндаль.",
        "pair": "flat-white",
        "badge": "",
        "image": "./assets/v2/almond-croissant.webp",
        "alt": "Миндальный круассан: один продукт крупным планом на светлом столе в кофейне Fox Coffee"
      },
      {
        "id": "cinnamon-roll",
        "name": "Булочка с корицей",
        "category": "bakery",
        "price": 290,
        "size": "120 г",
        "tagline": "Пряная и мягкая",
        "description": "Мягкое дрожжевое тесто, корица и тонкая ванильная глазурь. Особенно хороша с молочным кофе.",
        "ingredients": "Пшеничная мука, молоко, масло, сахар, дрожжи, яйцо, корица, ванильная глазурь.",
        "allergens": "Глютен, молоко, яйцо.",
        "pair": "latte",
        "badge": "",
        "image": "./assets/v2/cinnamon-roll.webp",
        "alt": "Булочка с корицей: один продукт крупным планом на светлом столе в кофейне Fox Coffee"
      },
      {
        "id": "cheesecake",
        "name": "Баскский чизкейк",
        "category": "cakes",
        "price": 390,
        "size": "140 г",
        "tagline": "Кремовый, с карамельной корочкой",
        "description": "Нежная сливочная середина и характерная тёмная корочка. Сбалансируйте сладость чашкой чёрного кофе.",
        "ingredients": "Сливочный сыр, сливки, сахар, яйцо, пшеничная мука.",
        "allergens": "Молоко, яйцо, глютен.",
        "pair": "americano",
        "badge": "",
        "image": "./assets/v2/cheesecake.webp",
        "alt": "Баскский чизкейк: один продукт крупным планом на светлом столе в кофейне Fox Coffee"
      },
      {
        "id": "chocolate-cake",
        "name": "Шоколадный торт",
        "category": "cakes",
        "price": 360,
        "size": "130 г",
        "tagline": "Какао и шоколадный крем",
        "description": "Влажный шоколадный бисквит, нежный крем и шоколадная стружка. К нему рекомендуем короткий эспрессо.",
        "ingredients": "Пшеничная мука, яйцо, сахар, какао, шоколад, сливки, сливочное масло.",
        "allergens": "Глютен, яйцо, молоко; состав шоколада уточняется.",
        "pair": "espresso",
        "badge": "",
        "image": "./assets/v2/chocolate-cake.webp",
        "alt": "Шоколадный торт: один продукт крупным планом на светлом столе в кофейне Fox Coffee"
      },
      {
        "id": "carrot-cake",
        "name": "Морковный торт",
        "category": "cakes",
        "price": 350,
        "size": "140 г",
        "tagline": "Пряности, орехи и сливочный крем",
        "description": "Мягкий морковный бисквит с грецким орехом и кремом из сливочного сыра. Нежный, с тёплыми пряными нотами.",
        "ingredients": "Морковь, пшеничная мука, яйцо, сахар, масло, грецкий орех, сливочный сыр, корица.",
        "allergens": "Глютен, яйцо, молоко, грецкий орех.",
        "pair": "filter",
        "badge": "",
        "image": "./assets/v2/carrot-cake.webp",
        "alt": "Морковный торт: один продукт крупным планом на светлом столе в кофейне Fox Coffee"
      }
    ]
  },
  "offers": [
    {
      "id": "morning",
      "name": "Утро в Fox",
      "caption": "Хрустящий круассан и мягкий капучино.",
      "coffee": "cappuccino",
      "dessert": "croissant",
      "count": 1
    },
    {
      "id": "pause",
      "name": "Сладкая пауза",
      "caption": "Чёрный кофе и нежный баскский чизкейк.",
      "coffee": "filter",
      "dessert": "cheesecake",
      "count": 1
    },
    {
      "id": "together",
      "name": "Время вдвоём",
      "caption": "Два капучино и два чизкейка. Для долгого разговора.",
      "coffee": "cappuccino",
      "dessert": "cheesecake",
      "count": 2
    }
  ]
};

