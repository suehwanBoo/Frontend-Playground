# react-deploy-practice
github action을 활용한 react 프로젝트 S3, cloudfront, dns




## 필요이유
이전 Tripeer 프로젝트에서의 환경
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
-> Get Object는 한마디로 안에 파일 객체들을 Get하는 명령을 허용해주는 것이다.

#### 6) ARN 부분의 경우 본인의 버킷 ARN을 복사해서 넣어주고 이후 Generate Policy 클릭 후 나온 JSON 정책을 복사해서 AWS에 넣어준다.

#### 7) 이후 완료를 누르고 만약 오류가 뜬다면 JSON 부분에서 Resourse : 이후 적혀있는 arn 문자열의 뒤에 /*을 추가하고 변경사항 저장을 누른다.
ex) "Resource": "arn:aws:s3:::ararararararar위치는 여기 뒤입니다/*"

#### 이후 아까 index.html로 접근해보면
![image](https://github.com/user-attachments/assets/43b26654-a119-4e68-95e6-dc4e5947f6b4)

히힣 된다.

이렇게 하면 S3 버킷 만들기는 끝이다. 다음 파트인 CloudFront 만들고 S3와 연결하기를 해보도록 하자


## 2. CloudFront와 S3를 연결하여, CloudFront를 통해서 S3에 접근 가능하게 하기

#### 1) 해당 설정을 하기 이전, 아까 S3가 잘 되는지 확인하려고 했던 S3 퍼블릭 엑세스 설정을 버킷의 권한에 들어가 퍼블릭 엑세스 모두 체크하여 퍼블릭 엑세스를 차단해주자.
![image](https://github.com/user-attachments/assets/53be7608-e155-4bf6-bd68-99f418bbcc81)

#### 2) AWS의 CloudFront 서비스에 들어가 CloudFront 배포 시작을 누른 원본 Origin domain을 눌러 아까 설정한 S3 버킷을 클릭하자
![image](https://github.com/user-attachments/assets/36437187-cfd2-4dbf-97f3-9347aa98a01c)

#### 3) 이후 하위의 원본 액세스에서 OAC 즉, 원본 액세스 제어 설정을 클릭하자, 이 부분이 CloudFront로만 S3를 접근하게 하는 설정이다.
![image](https://github.com/user-attachments/assets/8457ba27-95e2-454f-bae7-6f2a1fe80b66)

#### 4) 위를 클릭한 후 Origin access controll에 내 S3를 넣어주면 된다.
#### 경고가 나올건데 이건 이후 S3 정책을 위의 설정에 맞게 업데이트 해줄것이다.

#### 5) 나머지는 그대로 두고 뷰어 설정의 뷰어 프로토콜을 HTTP to HTTPS로 바꿔준다.
![image](https://github.com/user-attachments/assets/280a4d93-786e-4f46-b346-79ed5a92edbe)

#### 6) 이후 웹 어플리케이션 방화벽(WAF) 설정을 비활성화로 둔다.(활성화로 두면 비용이 든다고 하위 항목에 겁을 준다.)
![image](https://github.com/user-attachments/assets/723cd9b0-cb2f-4f33-a4a2-c02dfb58e842)

#### 7) 도메인 같은 경우에는 다음 프로세스에 재설정 하는것으로 하고 배포 생성을 눌러 CloudFront 설정을 완료해보자

#### 8) 완료 이후 S3 정책을 업데이트 해줘야 한다고 뜨니 해당 경고에 정책 복사를 클릭해 정책을 복사해주자.
![image](https://github.com/user-attachments/assets/2efa4614-84cf-4c81-b8b9-4f51d170f08f)

#### 9) S3 버킷에 다시 들어가 권한 탭의 정책을 위에서 복사한 정책으로 덮어씌우고 변경사항을 저장하자.

#### 10) 이후 CloudFront의 배포 도메인 이름 주소를 통해 S3에 저장된 index.html로 접근을 해보자.
![image](https://github.com/user-attachments/assets/2dd6fe97-863a-42af-9685-d44ef8ace0e5)

#### 깔끔하게 동작한다.
#### 하지만 눈썰미가 좋다면 문제를 찾을 수 있는데 바로 도메인 이후에 /index.html로 접근을 해야하는 점이다.

#### 11) 이 부분을 해결하기 위해서 CloudFront의 일반탭에 설정을 편집해보자
![image](https://github.com/user-attachments/assets/d3f42555-8cbc-4da6-953c-18e88d54eb30)

#### 12) 편집에 들어간 후 Default root object를 index.html로 바꾸면 도메인을 치고 들어갔을때 index.html을 서빙하게 된다.
![image](https://github.com/user-attachments/assets/0c88aae1-149c-4b26-8522-4e369c518b03)

#### 13) 캐싱을 무효화하고 다시 적용하는데 시간이 살짝 들기에 1~2분 정도 기다렸다가 기본 도메인으로 들어가면 적용된것을 확인할 수 있다.
![image](https://github.com/user-attachments/assets/3a3bc76e-5830-47fb-81ec-56000926bc4c)

## 3. 도메인을 등록하여 CloudFront와 통합하고 Amazon Certificate Manager를 통해 도메인의 SSL인증서를 발급받아 https 적용하기(생략 가능)

#### 1) 가비아나 DNS 서비스를 제공해주는 서비스를 활용하여 도메인을 만들고 Amazon Certificate Manager를 통해 우선 SSL 인증서를 발급받자.
#### 해당 사항을 도와주고 싶으나 이미 해당 도메인으로 서비스의 SSL 인증서를 발급받은 상태라 도메인을 사고 CNAME을 등록해서 하면 크게 어렵지 않으니 혼자 해보자.

#### 2) 이후 CloudFront의 일반 - 설정 - 편집에 들어가 도메인을 추가한다.
![image](https://github.com/user-attachments/assets/48003ee6-2ccc-4622-b3f1-ca431a112412)

#### 3) 그리고 발급받은 SSL 인증서를 클릭하고 변경사항을 저장하면 된다.
![image](https://github.com/user-attachments/assets/cebbba7f-2827-4c36-91e3-2686c31ba56a)

#### 결과 화면
![image](https://github.com/user-attachments/assets/a89780cb-e9b9-47c3-ad83-ade0ed6c8606)


## 4. Github action을 통해 레포지토리와 S3 + CloudFront를 연결하여 CI/CD 구축하기

#### 1) 우선 git 레포지토리를 만들어 react 프로젝트로 구성해주자.

#### 2) github 웹의 레포지토리에 들어가 action 탭에 들어가자### 6) ARN 부분의 경우 본인의 버킷 ARN을 복사해서 넣어주고 이후 Generate Policy 클릭 후 나온 JSON 정책을 복사해서 AWS에 넣어준다.

#### 7) 이후 완료를 누르고 만약 오류가 뜬다면 JSON 부분에서 Resourse : 이후 적혀있는 arn 문자열의 뒤에 /*을 추가하고 변경사항 저장을 누른다.
ex) "Resource": "arn:aws:s3:::ararararararar위치는 여기 뒤입니다/*"

#### 이후 아까 index.html로 접근해보면
![image](https://github.com/user-attachments/assets/43b26654-a119-4e68-95e6-dc4e5947f6b4)

히힣 된다.

이렇게 하면 S3 버킷 만들기는 끝이다. 다음 파트인 CloudFront 만들고 S3와 연결하기를 해보도록 하자


## 2. CloudFront와 S3를 연결하여, CloudFront를 통해서 S3에 접근 가능하게 하기

#### 1) 해당 설정을 하기 이전, 아까 S3가 잘 되는지 확인하려고 했던 S3 퍼블릭 엑세스 설정을 버킷의 권한에 들어가 퍼블릭 엑세스 모두 체크하여 퍼블릭 엑세스를 차단해주자.
![image](https://github.com/user-attachments/assets/53be7608-e155-4bf6-bd68-99f418bbcc81)

#### 2) AWS의 CloudFront 서비스에 들어가 CloudFront 배포 시작을 누른 원본 Origin domain을 눌러 아까 설정한 S3 버킷을 클릭하자
![image](https://github.com/user-attachments/assets/36437187-cfd2-4dbf-97f3-9347aa98a01c)

#### 3) 이후 하위의 원본 액세스에서 OAC 즉, 원본 액세스 제어 설정을 클릭하자, 이 부분이 CloudFront로만 S3를 접근하게 하는 설정이다.
![image](https://github.com/user-attachments/assets/8457ba27-95e2-454f-bae7-6f2a1fe80b66)

#### 4) 위를 클릭한 후 Origin access controll에 내 S3를 넣어주면 된다.
#### 경고가 나올건데 이건 이후 S3 정책을 위의 설정에 맞게 업데이트 해줄것이다.

#### 5) 나머지는 그대로 두고 뷰어 설정의 뷰어 프로토콜을 HTTP to HTTPS로 바꿔준다.
![image](https://github.com/user-attachments/assets/280a4d93-786e-4f46-b346-79ed5a92edbe)

#### 6) 이후 웹 어플리케이션 방화벽(WAF) 설정을 비활성화로 둔다.(활성화로 두면 비용이 든다고 하위 항목에 겁을 준다.)
![image](https://github.com/user-attachments/assets/723cd9b0-cb2f-4f33-a4a2-c02dfb58e842)

#### 7) 도메인 같은 경우에는 다음 프로세스에 재설정 하는것으로 하고 배포 생성을 눌러 CloudFront 설정을 완료해보자

#### 8) 완료 이후 S3 정책을 업데이트 해줘야 한다고 뜨니 해당 경고에 정책 복사를 클릭해 정책을 복사해주자.
![image](https://github.com/user-attachments/assets/2efa4614-84cf-4c81-b8b9-4f51d170f08f)

#### 9) S3 버킷에 다시 들어가 권한 탭의 정책을 위에서 복사한 정책으로 덮어씌우고 변경사항을 저장하자.

#### 10) 이후 CloudFront의 배포 도메인 이름 주소를 통해 S3에 저장된 index.html로 접근을 해보자.
![image](https://github.com/user-attachments/assets/2dd6fe97-863a-42af-9685-d44ef8ace0e5)

#### 깔끔하게 동작한다.
#### 하지만 눈썰미가 좋다면 문제를 찾을 수 있는데 바로 도메인 이후에 /index.html로 접근을 해야하는 점이다.

#### 11) 이 부분을 해결하기 위해서 CloudFront의 일반탭에 설정을 편집해보자
![image](https://github.com/user-attachments/assets/d3f42555-8cbc-4da6-953c-18e88d54eb30)

#### 12) 편집에 들어간 후 Default root object를 index.html로 바꾸면 도메인을 치고 들어갔을때 index.html을 서빙하게 된다.
![image](https://github.com/user-attachments/assets/0c88aae1-149c-4b26-8522-4e369c518b03)

#### 13) 캐싱을 무효화하고 다시 적용하는데 시간이 살짝 들기에 1~2분 정도 기다렸다가 기본 도메인으로 들어가면 적용된것을 확인할 수 있다.
![image](https://github.com/user-attachments/assets/3a3bc76e-5830-47fb-81ec-56000926bc4c)

## 3. 도메인을 등록하여 CloudFront와 통합하고 Amazon Certificate Manager를 통해 도메인의 SSL인증서를 발급받아 https 적용하기(생략 가능)

#### 1) 가비아나 DNS 서비스를 제공해주는 서비스를 활용하여 도메인을 만들고 Amazon Certificate Manager를 통해 우선 SSL 인증서를 발급받자.
#### 해당 사항을 도와주고 싶으나 이미 해당 도메인으로 서비스의 SSL 인증서를 발급받은 상태라 도메인을 사고 CNAME을 등록해서 하면 크게 어렵지 않으니 혼자 해보자.

#### 2) 이후 CloudFront의 일반 - 설정 - 편집에 들어가 도메인을 추가한다.
![image](https://github.com/user-attachments/assets/48003ee6-2ccc-4622-b3f1-ca431a112412)

#### 3) 그리고 발급받은 SSL 인증서를 클릭하고 변경사항을 저장하면 된다.
![image](https://github.com/user-attachments/assets/cebbba7f-2827-4c36-91e3-2686c31ba56a)

#### 결과 화면
![image](https://github.com/user-attachments/assets/a89780cb-e9b9-47c3-ad83-ade0ed6c8606)


## 4. Github action을 통해 레포지토리와 S3 + CloudFront를 연결하여 CI/CD 구축하기

#### 1) 우선 git 레포지토리를 만들어 react 프로젝트로 구성해주자.

#### 2) github 웹의 레포지토리에 들어가 Actions 탭에 들어가서 Set up Workflow yourself를 클릭하자.
![image](https://github.com/user-attachments/assets/aae94848-56d8-45aa-995b-9108ac980a24)

#### 3) 그러면 yml파일 작성으로 넘어가고 해당 yml 파일에 레포지토리에 어떤 트리거가 있을때 실행할 명령들을 적는다고 생각하면 된다.
#### 우리는 main 브랜치에 push가 있을때와, 다른 브랜치에서 pull-request가 통과되어 머지되었을때 S3에 빌드 파일을 올릴것 이기에 해당 트리거를 적어보자
![image](https://github.com/user-attachments/assets/761a15c2-136f-4041-a70f-e2c5e28ac083)
#### 해당 설정은 2개의 트리거가 생성된다.
#### main 브랜치에서 react 폴더 내에 변경사항이 push되면 작동하는 트리거
#### main 브랜치에 pr이 올라오고 react merge되며 react 폴더 내에 변경사항이 생기면 작동하는 트리거

#### 4) 이제 트리거를 적었으니 실행할 job을 적어보자, 첫번째로는 어떤 os 환경에서 돌아갈지를 적어보자
![image](https://github.com/user-attachments/assets/7b782907-824b-4300-82ff-362cdfa13f8c)
#### 나는 ubuntu 최신 버전을 선택했다, 버전은 마음대로 해도 된다.

#### 5) 그리고 아까 트리거에서 pr의 close가 있을때 해당 pr이 confirm된 pr인지 reject된 pr인지를 구분해야한다고 적었을거다 이걸 한번 만들어보자
![image](https://github.com/user-attachments/assets/8738c03c-2fcd-4e32-b840-abd4a6f8b68d)
#### if 옆에 | 는 명령어를 여러줄로 적겠다는 소리다.

#### 6) 이제 서버환경에 node.js를 설치해보자
![image](https://github.com/user-attachments/assets/46f8be90-965c-4298-a472-21c723124308)

#### 7) npm install, build 진행하기
![image](https://github.com/user-attachments/assets/e67485ec-e05c-4f6d-97ea-e8cf65c522f9)

#### 이렇게 하면 필요한 패키지를 설치하고, 빌드가 완료된다 여기서 환경변수(env)가 만약 필요하다면 환경변수를 추가할 수 있다.
#### 8) 환경변수 추가를 위해 github 레포지토리에 settings를 들어간후 해당 탭을 눌러준다.
![image](https://github.com/user-attachments/assets/d1f41b20-5f0c-47b2-8b09-9bc8343e1d95)

#### 9) 여기서 해당 버튼을 클릭해 환경변수들을 추가해준다. 추후에 AWS 접근을 하는 id, password도 여기에 저장을 할것이라 기억해놓으면 좋다.
![image](https://github.com/user-attachments/assets/1b4f9cd3-cb33-4c87-9476-6ab8d3ab4dfc)

#### 나는 이렇게 저장했다.
![image](https://github.com/user-attachments/assets/ee0efbef-6328-4c66-bab9-e2a35a1bd36f)

#### 10) 그후 yml 파일로 돌아 빌드 전에 env 파일을 추가하는 프로세스를 넣어준다.
![image](https://github.com/user-attachments/assets/369875dd-1fcf-40ab-bf1b-7a11d6478c45)

#### 여기까지가 가상환경을 활용하여 react 패키지를 빌드하는 프로세스이다.
#### 이후부터는 완성된 빌드 파일을 S3에 올리고, CloudFront가 이전에 들고있던 캐싱 파일을 무효화하여 CI/CD를 완전히 구축해보자

#### 11) 우선 AWS에 접속하여 IAM 계정에 S3와 CloudFront에 접근 권한을 주어야한다.
#### IAM 게정을 통해 github action에서 AWS의 내 서비스에 접근할 수 있는 권한을 가지는 것이다.

#### 12) IAM 서비스에 들어가 사용자 탭에 들어가자
![image](https://github.com/user-attachments/assets/37c15465-ab0d-4433-ab2a-94c0434388d1)

#### 13) 사용자 생성을 누르고 이름을 등록해주자
![image](https://github.com/user-attachments/assets/9afa789e-037c-4509-a2c9-2de678f55f7a)

#### 14) 권한 옵션에 직접 권한 추가를 누르고
![image](https://github.com/user-attachments/assets/48540b1a-078e-419f-aa64-2c4a28e1b571)

#### 15) 권한으로 S3 Full Access와 CloudFront Full Access를 추가해주자 이걸로 해당 IAM 계정은 S3와 CLoudFront의 전체 접근 권한을 가진다.
![image](https://github.com/user-attachments/assets/f7dce22b-06d8-45ea-a3ce-b78dff6b0e6f)
![image](https://github.com/user-attachments/assets/397fa2cf-87be-407f-aa2a-9c1b8cf89e37)

#### 16) 이후 사용자 생성을 눌러서 사용자를 만들어보자

#### 17) 이후 해당 IAM 계정에 들어가 액세스 키 만들기를 누르자
![image](https://github.com/user-attachments/assets/eda46207-7f87-437c-ac4b-da694300d5d4)

#### 18) CLI를 클릭하고 다음을 누르고 액세스키를 만들어주자
![image](https://github.com/user-attachments/assets/b1fc4e35-6baa-4d80-9998-3b06d9e69724)

#### 19) 키를 만들면 액세스 키 비밀 액세스키가 나오는데 이를 따로 저장해주자 처음만 이걸 볼 수 있어서 꼭 여기서 저장해줘야한다.

#### 20) 이후 이를 아까전 env 저장을 했듯 github secrets에 원하는 변수명으로 저장해주자
![image](https://github.com/user-attachments/assets/2b19e49e-a83b-48fa-a0d2-ce5f2ef8d67f)

#### 21) 다시 yml로 돌아와 S3에 올리는 명령어를 작성해보자
![image](https://github.com/user-attachments/assets/529cb3ad-1fe5-4e7c-8edd-c43f72aab313)

#### 22) CloudFront의 캐시를 무효화하는 작업을 하기전에 CloudFront의 distribution id를 발급받아야한다.
#### CloudFront 버킷에 들어가 create를 누르고 모두 다음을 눌러주면 된다.
![image](https://github.com/user-attachments/assets/48b2acf9-6482-4f40-aeae-305f11f0b811)

#### 23) 완료하면 이후 나온 distribution id를 github secrets에 저장해주자.
![image](https://github.com/user-attachments/assets/633c9071-f3fc-4dca-99f4-fb371db3edba)
![image](https://github.com/user-attachments/assets/03a2600e-b07b-4a7d-a261-4557ef2b4a02)

#### 24) 다시 yml로 돌아와 나머지 코드를 작성해주자
#### create-invalidation => 무효화 생성
#### 해당 distribution id를 기입하고
#### path는 이전에 캐싱한 전체 파일을 무효화 하겠다는 말이다.
![image](https://github.com/user-attachments/assets/11861a06-ab7c-4800-a719-bf9bb67d2479)


## 이렇게 하면 CI/CD 프로세스가 완료된다.


## 결과물
![image](https://github.com/user-attachments/assets/4ffd6961-bcb3-43a1-9aaf-ea6e50df9d7e)
![image](https://github.com/user-attachments/assets/7e6f84ac-7de0-4ed0-a25a-04f5968a70c1)


#### 안되거나 모르는거 있으면 카톡주세요.




















 
