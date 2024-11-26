function newCourse(grade, semester, title, professorName) {
    return {
        year: 2024,
        grade,
        semester,
        title,
        professorName
    };
}

// 1학년 1학기 과목
const oneOneCourses = [
    newCourse(1, 1, '프로그래밍입문', '이동희'),
    newCourse(1, 1, '컴퓨터과학개론', '황혜수')
]

// 1학년 2학기 과목
const oneTwoCourses = [
    newCourse(1, 2, 'C언어및실습', '김성환'),
    newCourse(1, 2, 'C언어및실습', '남현우'),
    newCourse(1, 2, '창의공학기초설계', '노창배')
]

// 2학년 1학기 과목
const twoOneCourses = [
    newCourse(2, 1, '객체지향프로그래밍및실습', '김영직'),
    newCourse(2, 1, '이산수학', '정형구'),
    newCourse(2, 1, '콘텐츠창업실무', '김성환'),
    newCourse(2, 1, '객체지향프로그래밍및실습', '유하진'),
    newCourse(2, 1, '확률과통계', '유하진'),
    newCourse(2, 1, '멀티미디어응용', '김성환'),
    newCourse(2, 1, '논리회로및실습', '김민호'),
    newCourse(2, 1, '선형대수', '김민호')
];

// 2학년 2학기 과목
const twoTwoCourses = [
    newCourse(2, 2, '자료구조', '송영록'),
    newCourse(2, 2, '프로그래밍언어론', '김지은'),
    newCourse(2, 2, '인터넷프로그래밍및실습', '추칠엽'),
    newCourse(2, 2, '데이터통신', '안상현'),
    newCourse(2, 2, '수치해석', '김민호'),
    newCourse(2, 2, '유닉스프로그래밍', '이동희')
]

// 3학년 1학기 과목
const threeOneCourses = [
    newCourse(3, 1, '화일처리론', '박찬길'),
    newCourse(3, 1, '컴퓨터통신', '안상현'),
    newCourse(3, 1, '컴퓨터알고리즘', '김진석'),
    newCourse(3, 1, '윈도우즈프로그래밍', '이동희'),
    newCourse(3, 1, '운영체제', '이동희'),
    newCourse(3, 1, '컴퓨터구조론', '송영록'),
    newCourse(3, 1, '컴퓨터보안', '최혁')
]

// 3학년 2학기 과목
const threeTwoCourses = [
    newCourse(3, 2, '데이터베이스', '홍의경'),
    newCourse(3, 2, '인공지능', '이경재'),
    newCourse(3, 2, '소프트웨어응용', '황혜수'),
    newCourse(3, 2, '소프트웨어공학', '김지은'),
    newCourse(3, 2, '임베디드시스템설계', '이동희'),
    newCourse(3, 2, '마이크로프로세서설계및실습', '최혁')
]

// 4학년 1학기 과목
const fourOneCourses = [
    newCourse(4, 1, '멀티프로세서컴퓨팅', '노창배'),
    newCourse(4, 1, '웹정보시스템', '황헤수'),
    newCourse(4, 1, '컴퓨터과학종합설계', '최혁'),
    newCourse(4, 1, '컴퓨터과학종합설계', '김진석'),
    newCourse(4, 1, '컴퓨터과학종합설계', '황혜수'),
    newCourse(4, 1, '딥러닝실제와응용', '이경재'),
    newCourse(4, 1, '데이터베이스설계', '홍의경')
]

// 4학년 2학기 과목
const fourTwoCourses = [
    newCourse(4, 2, '스마트금융개론', '김성환'),
    newCourse(4, 2, '컴퓨터과학종합설계', '김진석'),
    newCourse(4, 2, '컴퓨터그래픽스', '김민호'),
    newCourse(4, 2, '네트워크보안', '안상현'),
    newCourse(4, 2, '컴퓨터과학종합설계', '최혁')
]

module.exports = { oneOneCourses, oneTwoCourses, twoOneCourses, twoTwoCourses, threeOneCourses, threeTwoCourses, fourOneCourses, fourTwoCourses };
