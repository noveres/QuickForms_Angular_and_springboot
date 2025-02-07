package com.example.quiz12.constants;

public enum ResMessage {
	// 列舉的項目
	SUCCESS(200, "Success!!"), //
	PARAM_NAME_ERROR(400, "Param name error!!"), //
	PARAM_DESCRIPTION_ERROR(400, "Param description error!!"), //
	PARAM_START_DATE_ERROR(400, "Param start date error!!"), //
	PARAM_END_DATE_ERROR(400, "Param end date error!!"), //
	PARAM_DATE_ERROR(400, "Param date error!!"), //
	PARAM_QUES_ID_ERROR(400, "Param question id error!!"), //
	PARAM_QUES_NAME_ERROR(400, "Param question quiz name error!!"), //
	PARAM_TYPE_ERROR(400, "Param type error!!"), //
	PARAM_OPTIONS_ERROR(400, "Param options error!!"), //
	PARAM_QUES_LIST_ERROR(400, "Param question list error!!"),
	DATA_SAVE_ERROR(400, "Data save error!!"),//
	DATA_UPDATE_ERROR(400, "Data update error!!"),//
	QUES_TYPE_MISMATCH(400, "Ques type mismatch!!"), //
	PARAM_QUIZ_ID_ERROR(400, "Param quiz id error!!"),//
	QUIZ_NOT_FOUND(404, "Quiz not found!!"),//
	QUIZ_ID_MISMATCH(400, "Quiz id mismatch!!"),
	PARAM_USERNAM_ERROR(400, "Param username error!!"),//
	PARAM_Eamil_ERROR(400, "Param Eamil error!!"),//
	PARAM_PASSWORD_ERROR(400, "Param password error!!"),//
	PARAM_AGE_ERROR(400, "Param AGE error!"),
	EMAIL_DUPLICATED(400, "Email DUPLICATED!!"),//
	OUT_OF_DATA_RANGE(400, "Out of data range!!"),//
	AMSWER_IS_REQUIRED(400, "Answer is required!!"),
	ONE_OPTION_IS_ALLOWE(400, "One option is required!!"),
	OPTIONS_PATTERN_ERROR(400, "Options pattern error!!"),
	OPTION_ANSWER_MISMATCH(400, "Option answer mismatch!!"),//
//	OUT_OF_DATA_RANGE(400, "Out of data range!!"),//
	;//

	private int code;

	private String message;

	private ResMessage(int code, String message) {
		this.code = code;
		this.message = message;
	}

	public int getCode() {
		return code;
	}

	public String getMessage() {
		return message;
	}

}
