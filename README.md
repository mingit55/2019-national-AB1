# 2019-national-AB-1
2019년 전국 기능대회 과제 1회차

### 새로 추가한 부분

#### 1. 일러스트의 붓 툴을 이용하여 로고의 곡선 무늬를 삽입해 보았다.
    주제가 '부산국제영화제' 이기 때문에 부산의 이미지에 맞춰서 파도 무늬를 넣고자 사용해 보았는데
    나름대로 성공적이었다. 기능대회에서 바다는 단골주제이기 때문에 다음에도 써먹어도 괜찮을 것 같다.

#### 2. 각 섹션마다 어느정도 템플릿을 구성해 두어 나중에 추가하기 용이하게 만들었다.
    A과제에서 작업한 CSS파일을 가지고 모든 페이지를 구성해야하므로, 주도면밀하게 코드를 구성하는것이
    좋다고 판단했다. 각 섹션의 제목과 같은 필수적으로 들어가는 디자인은 미리 클래스를 통해 구성해두면
    나중에 페이지를 새로 만들때 간편하기 때문에 앞으로도 이렇게 구성할 것이다.
    
### 다음부터 고칠 부분

#### 1. 외부 스크립트를 전혀 사용하지 않았다.
    jQuery나 Bootstrap, Fontawesome 등 대회 내에서 기본적으로 제공하는 요소들을 전혀 사용하지 않았다.
    지금은 대회가 목적이기 때문에 좀 더 요소를 부각시킬 수 있는 Fontawesome이나, 간단한 jQuery 문법,
    레이아웃 구성시 Bootstrap을 사용하는 정도는 하는 것이 좋겠다.
    
#### 2. C과제 코드 구성이 난잡하다.
    속도를 중시하여 MainController 하나에 모든 페이지가 들어가도록 했었지만 많이 보기 힘들다.
    하지만 속도는 그대로 유지해야 하기 때문에 좀 더 체계적으로 메소드를 분류하는 등의 작업이 필요할 것 같다.
    특정 이름이나 접두사/접미사를 덧붙이는 건 어떨까 싶다.

#### 3. Table 디자인이 좀 떨어진다.
    특히 C과제에서는 데이터를 보여주는 식의 페이지가 많이 등장하기 때문에 이를 문자열의 길이마다 가독성 좋게
    나열해주는 <table>은 중요한 요소라고 할 수 있을 것이다. 따로 다양한 디자인을 살펴보며 연구해 볼
    필요성을 느낀다.
