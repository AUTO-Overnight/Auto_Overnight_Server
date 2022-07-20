# ⚡ Auto_Overnight_API

- 외박 신청 및 로그인 등 여러 요청을 처리하는 API입니다.
- nodejs -> golang으로 변경하여 AWS lambda에 배포중입니다.

## Build
`GOARCH=amd64 GOOS=linux go build` 후에 생긴 바이너리파일을 zip로 압축해 aws lambda에 업로드합니다


## API

- 모든 요청은 POST를 사용합니다.

### login

* 로그인을 시도하는 함수입니다.

#### 입력

```
{
    "id" : "201112345678",
    "password" : "1234"
}
```

* `id` 학교 홈페이지 id
* `password` 학교 홈페이지 비밀번호

#### 출력

```
{
    "cookies": {
        "JSVSESSIONID": "",
        "_SSO_Global_Logout_url": "",
        "kalogin": ""
    },
    "name": "이서윤",
    "outStayFrDt": [
        "20220720",
        "20220719",
        "20220711",
        "20220710",
        "20220709",
        "20220708",
        "20220707"
    ],
    "outStayStGbn": [
        "2",
        "2",
        "2",
        "2",
        "2",
        "2",
        "2"
    ],
    "outStayToDt": [
        "20220720",
        "20220719",
        "20220711",
        "20220710",
        "20220709",
        "20220708",
        "20220707"
    ],
    "tmGbn": "5",
    "yy": "2022"
}
```

* `cookies` 로그인하고 얻어온 쿠키와 세션

* `name` 이름

* `yy` 년도

* `tmGbn`  학기 구분 ( 1학기 : 1 / 2학기 : 2 / 여름학기 : 5 / 겨울학기 : 6 )

* `outStayFrDt` 외박신청 시작 날짜

* `outStayToDt` 외박신청 종료 날짜

* `outStayStGbn`  1 : 미승인 / 2 : 승인

### sendStayOut

* 외박 신청을 하는 함수입니다.

#### 입력

```
{
    "date_list" : ["20210831", "20210901", "20210902", "20210903", "20210904", "20210905"],
    "is_weekend" : [0, 0, 0, 1, 1, 1],
    "outStayAplyDt" : "20210831",
    "cookies": {
        "JSVSESSIONID": "",
        "_SSO_Global_Logout_url": "",
        "kalogin": ""
    }
}
```

* `date_list` 외박신청 날짜가 담긴 날짜의 리스트

* `is_weekend`  0 : 평일 / 1 : 주말

* `outStayAplyDt`  오늘 날짜

* `cookies` 로그인하고 얻어온 쿠키와 

#### 출력

```
{
    "outStayFrDt": [
        "20210905",
        "20210904",
        "20210903",
        "20210902",
        "20210901",
        "20210831",
        "20210830",
        "20210827",
        "20210825"
    ],
    "outStayToDt": [
        "20210905",
        "20210904",
        "20210903",
        "20210902",
        "20210901",
        "20210831",
        "20210830",
        "20210829",
        "20210825"
    ],
    "outStayStGbn": [
        "1",
        "1",
        "1",
        "1",
        "1",
        "1",
        "2",
        "2",
        "2"
    ]
}
```

* 외박신청에 성공하면 외박 신청 내역을 return 합니다.

* `outStayFrDt` 외박신청 시작 날짜

* `outStayToDt` 외박신청 종료 날짜

* `outStayStGbn`  1 : 미승인 / 2 : 승인

### findStayOutList

* 외박 신청 내역을 조회하는 함수입니다.

#### 입력

```
{
    "yy" : "2021",
    "tmGbn" : "2",
    "userNm" : "홍길동",
    "cookies": {
        "JSVSESSIONID": "",
        "_SSO_Global_Logout_url": "",
        "kalogin": ""
    }
}
```

* `yy`  년도

* `tmGbn`  학기 구분 / 1학기 : 1 / 2학기 : 2 / 여름학기 : 5 / 겨울학기 : 6

* `userNm` 이름

* `cookies` 로그인하고 얻어온 쿠키 세션

#### 출력

```
{
    "outStayFrDt": [
        "20210830",
        "20210827",
        "20210825"
    ],
    "outStayToDt": [
        "20210830",
        "20210829",
        "20210825"
    ],
    "outStayStGbn": [
        "2",
        "2",
        "2"
    ]
}
```

* `outStayFrDt` 외박신청 시작 날짜

* `outStayToDt` 외박신청 종료 날짜

* `outStayStGbn`  1 : 미승인 / 2 : 승인

### findPointList

* 상벌점 내역을 조회하는 함수입니다.

#### 입력

```
{
    "yy" : "2022",
    "tmGbn" : "1",
    "userNm" : "이서윤",
    "cookies": {
        "JSVSESSIONID": "",
        "_SSO_Global_Logout_url": "",
        "kalogin": ""
    }
}
```
* `yy` 년도

* `tmGbn` 학기 구분 / 1학기 : 1 / 2학기 : 2 / 여름학기 : 5 / 겨울학기 : 6

* `userNm` 이름

* `cookies` 로그인하고 얻어온 쿠키와 세션

#### 출력

```
{
    "cmpScr": [
        "-6",
        "-6"
    ],
    "lifSstArdGbn": [
        "2",
        "2"
    ],
    "ardInptDt": [
        "20210808",
        "20210807"
    ],
    "lifSstArdCtnt": [
        "체온미측정",
        "체온미측정"
    ]
}
```

* `cmpScr`  상벌점 수치

* `lifSstArdGbn`  상벌점 구분 / 1 : 상점 / 2 : 벌점

* `ardInptDt`  상벌일자

* `lifSstArdCtnt`  상벌내용
