
# 트리플 여행자 클럽 마일리지 서비스 API 명세서

## Tables

### User
| English | Korean | Type | 
| ----------- | ----------- |   ----------- |  
| UserId | 유저 일련번호 | string(UUID) |
| name | 유저 이름 | string |
| point |  해당 유저의 보유 포인트<br>default: 0 | number |
- 유저 관련 validation, 회원가입, 로그인 기능은 구현하지 않는다.

<br>

### AttachedPhoto
| English | Korean | Type | 
| ----------- | ----------- |   ----------- |  
| attachedPhotoId | 리뷰에 첨부된 이미지 일련번호 | string(UUID) |
| fileName | 리뷰에 첨부된 이미지 이름 | string |

<br>

### Place
| English | Korean | Type | 
| ----------- | ----------- |   ----------- |  
| placeId | 장소의 일련번호 | string(UUID) |
| name | 장소 이름 | string |

<br>

### Review
| English | Korean | Type | 
| ----------- | ----------- |   ----------- |  
| reviewId | 리뷰 일련번호 | string(UUID) |
| content | 리뷰 내용 | string |
| placeId | 장소의 일련번호 | string (UUID) <br> **Review**Has**Place** |
| userId | 유저 일련번호 | string (UUID) <br> **Review**Has**User** |
| point | 해당 리뷰에 대한 포인트 | number |

<br>

### ReviewHasAttachedPhoto
| English | Korean | Type | 
| ----------- | ----------- |   ----------- |  
| reviewId | 리뷰 일련번호 | string(UUID) |
| attachedPhotoId | 리뷰에 첨부된 이미지 일련번호 | string(UUID) |

<br>

### PointLog
| English | Korean | Type | 
| ----------- | ----------- |   ----------- |  
| pointLogId | 포인트 증감 이력 일련번호 | string(UUID) |
| userId | 유저 일련번호 | string(UUID) |
| placeId | 장소의 일련번호 | string(UUID) |
| point | 포인트 증감량 | number |
| description | 포인트 증감 이력에 대한 상세 내용 | string (JSON형태 string)<br> ```{"type":"REVIEW","action":"MOD","reviewId":"3dff984e-54fb-4fb2-983a-11c72cb3e013","content":"","attachedPhotoIds":["e83506ed-9e79-4684-8f7d-d9784f7b37c3"],"userId":"9c44ce34-194f-42aa-a96a-cb934f00a4e0","placeId":"b00b6272-d6b7-43c0-9367-b7821695c349"}``` |

<br>

### ERD
<img width="553" alt="ERD" src="https://user-images.githubusercontent.com/62330320/176360341-d7467799-b964-4b8b-89a9-5342ff1fea88.png">

## API description
### common enums
```typescript
enum EventType {
  REVIEW = "REVIEW"
}

enum EventAction {
  ADD = "ADD",
  MOD = "MOD",
  DELETE = "DELETE"
}

enum PointSortType {
  POINT_DESC = 'POINT_DESC',
  POINT_ASC = 'POINT_ASC',
}
```


<table>
<tr>
<td>method / URL</td><td>Description</td><td>Request</td><td>Response</td>
</tr>
<tr>
<td>POST /events</td>
<td>
포인트 적립 API <br> - 해당 유저가 Request에 넣은 장소에 이미 리뷰를 작성했는지 확인<br>- 점수 재계산
</td>
<td>
<pre>
interface ICreateEventInput {
  type: EventType,
  action: EventAction,
  reviewId: string,
  content: string,
  attachedPhotoIds: string[],
  userId: string,
  placeId: string
}
</pre>
</td>
<td>
<pre>
{
  "pointLog": {
    "pointLogId": "dff11e58-8f98-4e01-9f5a-7cd315058d44",
    "userId": "68fa9dcf-c73b-4f9f-b2b4-6a332afc41e0",
    "placeId": "44a3bda3-a2fb-4f63-b108-a787738e6285",
    "point": 0,
    "description": "{\"type\":\"REVIEW\",\"action\":\"MOD\",\"reviewId\":\"cc422f9f-a403-4f7f-ae4e-d474198ac62d\",\"content\":\"최고에요!\",\"attachedPhotoIds\":[],\"userId\":\"68fa9dcf-c73b-4f9f-b2b4-6a332afc41e0\",\"placeId\":\"44a3bda3-a2fb-4f63-b108-a787738e6285\"}",
    "updatedAt": "2022-06-29T05:19:34.306Z",
    "createdAt": "2022-06-29T05:19:34.306Z"
  },
  "point": 1
}
</pre>
</td>
</tr>

<tr>
<td>GET /events/point/list?page=1&amp;pageSize=10&amp;sort=POINT_DESC</td>
<td>
포인트 전체 조회<br>- pagination
</td>
<td>
- page: 몇 번째 페이지<br>
- pageSize: 한 페이지당 데이터 개수<br>
- pointSortType: 
<pre>
enum PointSortType {
  POINT_DESC = 'POINT_DESC',
  POINT_ASC = 'POINT_ASC',
}
</pre>
</td>
<td>
<pre>
{
    "users": [
        {
            "userId": "1aefff8d-bc5f-4a17-a68f-4ca125532a0b",
            "name": "박트리플",
            "point": 0,
            "createdAt": "2022-06-28T02:04:25.000Z",
            "updatedAt": "2022-06-28T02:04:25.000Z"
        },
        {
            "userId": "9d992692-a184-4544-bdcd-c8005ff5044a",
            "name": "김트리플",
            "point": 0,
            "createdAt": "2022-06-28T02:04:25.000Z",
            "updatedAt": "2022-06-28T02:16:45.000Z"
        }
    ],
    "page": 1,
    "pageSize": 5,
    "totalSize": 2
}
</pre>
</td>
</tr>

<tr>
<td>GET /point/user/:userId</td>
<td>
특정 유저에 대한 포인트 조회
</td>
<td>
- userId: string(UUID)
</td>
<td>
<pre>
{
    "point": 2
}
</pre>
</td>
</tr>

</table>


<h3>리뷰 작성 rule</h3>
1. 유저는 장소마다 1개만을 리뷰만을 작성할 수 있다.<br>
2. 리뷰에 대한 포인트는 다음과 같이 계산한다.<br>
&nbsp; &nbsp; a. 1자 이상 텍스트 작성: 1점<br>
&nbsp; &nbsp; b. 1장 이상 사진 첨부: 1점<br>
&nbsp; &nbsp; c. 특정 장소에 첫 리뷰 작성: 1점<br>
