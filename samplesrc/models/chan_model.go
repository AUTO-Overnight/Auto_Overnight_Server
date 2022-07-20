package models

// FindUserNmModel 학생 이름, 학번 찾을 때 사용하는 모델
type FindUserNmModel struct {
	XML   Root
	Error error
}

// FindYYtmgbnModel 년도, 학기 찾을 때 사용하는 모델
type FindYYtmgbnModel struct {
	XML   Root
	Error error
}
