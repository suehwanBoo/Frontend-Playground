# react-deploy-practice
github action을 활용한 react 프로젝트 S3, cloudfront, dns




## 필요이유
이전 프로젝트에서의 환경
 : 프론트엔드(CSR) + 백엔드 환경에서 백엔드 서버(EC2)의 리버스 프록시(NginX)에 빌드된 프론트엔드 정적 파일들을 둔 형태

#### 이전 환경에서의 발생할 수 있는 문제점
1. 과도한 API 트래픽으로 백엔드 서버(EC2)가 불안정해질 경우 프론트 어플리케이션을 서빙할때 문제가 발생할 수 있음
   -> 클라이언트에서 화면 요청이 올 경우 Error Page가 뜨며 어플리케이션 전체가 멈춘듯한 경험을 줄 수도 있음
2. 반대로 페이지 요청 수가 과도하게 많아질 경우에도 정적 서빙뿐 아니라 API 성능까지 영향을 미칠 수 있음
   -> 즉, API서버와 화면 서빙이 서로 독립적이지 않고 연관성을 가져 서로의 성능에 영향을 끼칠 수 있음
3. CI/CD를 적용한 빌드 프로세스에서도 프론트엔드 환경과 백엔드 환경이 동일하여 서로의 환경에 영향을 끼칠 수 있음
   -> 백엔드 빌드가 완료될때 까지 프론트엔드가 기다려야 하는 등의 생산성 문제가 발생할 수 있음


## 해결방안
S3와 cloudfront를 활용하여 백엔드 서버에서 프론트 환경을 따로 분리시켜 적용해보자

## S3란?
AWS에서 제공하는 클라우드 스토리지 서비스, 즉 저장소의 역할을 하는 서비스이며 파일, 이미지, 데이터와 같은 다양한 유형의 파일들을 저장하고 요청에 따라 서빙하거나 관리할 수 있다.

#### 해결방법으로 S3를 택한 이유
1. CSR로 기획된 프로젝트의 경우 빌드시 정적 파일을 클라이언트 단 브라우저가 읽어서 이를 랜더링 하는 형태로 SSR과 달리 JS 파일을 읽고 랜더링 하는 서버가 필요 없다.
2. 즉 빌드된 결과물만 저장하고 이를 클라이언트의 브라우저에 서빙하는 저장소의 역할로 S3를 택할 수 있다.

## CloudFront란?
AWS에서 제공하는 CDN(Content Delivery Network)으로 빠른 속도로 파일들을 제공하고 추가적인 보안 기능을 제공하는 네트워크 서비스
여러 물리적인 지역(서울, 미국 등)에 엣지 로케이션을 두어 제공하려는 파일들을 캐싱하여 사용자가 물리적으로 가까운 지역에 연결되도록 하여 지연 속도를 줄인다.

#### 해결방방법으로 CloudFront를 택한 이유
1. AWS에서 제공하는 서비스와의 통합이 매우 간편하다.
2. S3에 저장된 빌드 결과물을 캐싱하여 매우 빠르게 유저들에게 제공할 수 있다.
3. SSL을 발급받아 HTTPS를 설정하는것이 간편하다.
4. AWS의 계정 소유자가 아닌 다른 사용자들이 S3에 직접 접근하는 것을 막고 CloudFront를 통해서만 접근 가능하게 하여 보안적으로 유리하다.


## 목표
이에 S3 + CloudFront로 프론트엔드 환경을 분리하고 github action을 통해 레포지토리에 S3, cloudfront를 연결하여 CI/CD를 구축하는 것

## 진행할 단계
1. 빌드된 파일을 저장할 S3 저장소 만들기
2. CloudFront와 S3를 연결하여, CloudFront를 통해서 S3에 접근 가능하게 하기
3. 도메인을 등록하여 CloudFront와 통합하고 Amazon Certificate Manager를 통해 도메인의 SSL인증서를 발급받아 https 적용하기
4. Github action을 통해 레포지토리와 S3 + CloudFront를 연결하여 CI/CD 구축하기

## 1. S3 저장소 만들기

#### 1) 아마존에 로그인 이후 S3 서비스에 들어가서 버킷만들기를 클릭한 후 사용할 버킷의 이름을 지어준다.
![image](https://github.com/user-attachments/assets/c4b8e628-536e-4397-993f-d7eb34dd8f61)

#### 2) 객체 소유권의 경우 내 아마존 계정에서 모두 관리할 것이고 이를 AWS에서 권장하기에 ACL을 비활성화로 둔다.
![image](https://github.com/user-attachments/assets/ab0b447b-558e-4fb1-b156-434839cd6a48)

#### 3) 버킷의 퍼블릭 엑세스는 이후 CloudFront를 통해서만 접근을 하게 하려면 모두 꺼야하지만, 우선적으로 S3가 제대로 동작하는지를 확인하기 위하여 모두 활성화하고 밑의 경고도 체크해서 제대로 작동하는지 확인후 이후 CloudFront를 적용하기 전에 다시 끄도록 하자
![image](https://github.com/user-attachments/assets/13269583-9619-479d-984d-cd800821045c)

#### 나머지 설정은 모두 AWS의 디폴트 설정으로 두고 버킷 만들기를 눌러서 S3 저장소를 만들어보자

#### 설정이 잘 되었는지 확인하기 위해 임시 index.html 파일을 하나 만들어 객체 업로드를 통해 S3에 올려보면
![image](https://github.com/user-attachments/assets/47bdf381-dc23-45f0-8b48-8c44f56cbb9e)

-> 요렇게 성공이 나오고 주소로 접근해보면
![image](https://github.com/user-attachments/assets/8410f35a-2a5b-4f53-8e10-f6ffed2edcbc)
안된다.

#### 이유는 퍼블릭 엑세스 설정을 모두 열어주어도 S3 객체의 정책에서 이를 열어주지 않으면 접근하지 못하는 것이다.

#### 4) 버킷의 권한탭에 들어간 후 버킷 정책 편집을 누르고 정책 생성기를 눌러본다.
![image](https://github.com/user-attachments/assets/fc4444f7-cca0-4e28-8315-069478f2f32b)

#### 5) 정책 생성기에서 다음의 설정들을 따라해준다.
![image](https://github.com/user-attachments/assets/d223b68b-ffee-4ca4-8bbf-a09eb1d71df6)
![image](https://github.com/user-attachments/assets/2593701b-e72e-4d30-b9fe-28bacf8d99df)

#### 6) ARN 부분의 경우 본인의 버킷 ARN을 복사해서 넣어주고 이후 Generate Policy 클릭 후 나온 JSON 정책을 복사해서 AWS에 넣어준다.

#### 7) 이후 완료를 누르고 만약 오류가 뜬다면 JSON 부분에서 Resourse : 이후 적혀있는 arn 문자열의 뒤에 /*을 추가하고 변경사항 저장을 누른다.
ex) "Resource": "arn:aws:s3:::ararararararar으아아악/*"

#### 이후 아까 index.html로 접근해보면
![image](https://github.com/user-attachments/assets/43b26654-a119-4e68-95e6-dc4e5947f6b4)

히힣 된다.

이렇게 하면 S3 버킷 만들기는 끝이다. 다음 파트인 CloudFront 만들고 S3와 연결하기를 해보도록 하자





 
