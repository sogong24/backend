// UUIDs for Courses
const COURSE_IDS = {
    // 1st Year, 1st Semester
    PROGRAMMING_INTRO: 'c1a11111-1111-1111-1111-111111111111',
    COMPUTER_SCIENCE_INTRO: 'c1a22222-2222-2222-2222-222222222222',

    // 1st Year, 2nd Semester
    C_LANGUAGE_LAB_1: 'c1b33333-3333-3333-3333-333333333333',
    C_LANGUAGE_LAB_2: 'c1b44444-4444-4444-4444-444444444444',
    CREATIVE_ENGINEERING_DESIGN: 'c1b55555-5555-5555-5555-555555555555',

    // 2nd Year, 1st Semester
    OBJECT_ORIENTED_PROGRAMMING_LAB_1: 'c2a66666-6666-6666-6666-666666666666',
    DISCRETE_MATHEMATICS: 'c2a77777-7777-7777-7777-777777777777',
    CONTENTS_STARTUP: 'c2a88888-8888-8888-8888-888888888888',
    OBJECT_ORIENTED_PROGRAMMING_LAB_2: 'c2a99999-9999-9999-9999-999999999999',
    PROBABILITY_AND_STATISTICS: 'c2a00000-0000-0000-0000-000000000000',
    MULTIMEDIA_APPLICATION: 'c2a11112-1212-1212-1212-121212121212',
    LOGIC_CIRCUIT_LAB: 'c2a13131-3131-3131-3131-313131313131',
    LINEAR_ALGEBRA: 'c2a14141-4141-4141-4141-414141414141',

    // 2nd Year, 2nd Semester
    DATA_STRUCTURES: 'c2b15151-5151-5151-5151-515151515151',
    PROGRAMMING_LANGUAGE_THEORY: 'c2b16161-6161-6161-6161-616161616161',
    INTERNET_PROGRAMMING_LAB: 'c2b17171-7171-7171-7171-717171717171',
    DATA_COMMUNICATION: 'c2b18181-8181-8181-8181-818181818181',
    NUMERICAL_ANALYSIS: 'c2b19191-9191-9191-9191-919191919191',
    UNIX_PROGRAMMING: 'c2b20202-0202-0202-0202-020202020202',

    // 3rd Year, 1st Semester
    FILE_PROCESSING_THEORY: 'c3a21212-1212-1212-1212-121212121212',
    COMPUTER_COMMUNICATION: 'c3a22222-2222-2222-2222-222222222222',
    COMPUTER_ALGORITHMS: 'c3a23232-3232-3232-3232-323232323232',
    WINDOWS_PROGRAMMING: 'c3a24242-4242-4242-4242-424242424242',
    OPERATING_SYSTEMS: 'c3a25252-5252-5252-5252-525252525252',
    COMPUTER_ARCHITECTURE: 'c3a26262-6262-6262-6262-626262626262',
    COMPUTER_SECURITY: 'c3a27272-7272-7272-7272-727272727272',

    // 3rd Year, 2nd Semester
    DATABASE: 'c3b28282-8282-8282-8282-828282828282',
    ARTIFICIAL_INTELLIGENCE: 'c3b29292-9292-9292-9292-929292929292',
    SOFTWARE_APPLICATION: 'c3b30303-0303-0303-0303-030303030303',
    SOFTWARE_ENGINEERING: 'c3b31313-1313-1313-1313-131313131313',
    EMBEDDED_SYSTEM_DESIGN: 'c3b32323-2323-2323-2323-232323232323',
    MICROPROCESSOR_DESIGN_LAB: 'c3b33333-3333-3333-3333-333333333333',

    // 4th Year, 1st Semester
    MULTIPROCESSOR_COMPUTING: 'c4a34343-4343-4343-4343-434343434343',
    WEB_INFORMATION_SYSTEM: 'c4a35353-5353-5353-5353-535353535353',
    COMPUTER_SCIENCE_COMPREHENSIVE_DESIGN_1: 'c4a36363-6363-6363-6363-636363636363',
    COMPUTER_SCIENCE_COMPREHENSIVE_DESIGN_2: 'c4a37373-7373-7373-7373-737373737373',
    COMPUTER_SCIENCE_COMPREHENSIVE_DESIGN_3: 'c4a38383-8383-8383-8383-838383838383',
    DEEP_LEARNING_APPLICATIONS: 'c4a39393-9393-9393-9393-939393939393',
    DATABASE_DESIGN: 'c4a40404-0404-0404-0404-040404040404',

    // 4th Year, 2nd Semester
    SMART_FINANCE_INTRO: 'c4b41414-1414-1414-1414-141414141414',
    COMPUTER_SCIENCE_COMPREHENSIVE_DESIGN_4: 'c4b42424-2424-2424-2424-242424242424',
    COMPUTER_GRAPHICS: 'c4b43434-3434-3434-3434-343434343434',
    NETWORK_SECURITY: 'c4b44444-4444-4444-4444-444444444444',
    COMPUTER_SCIENCE_COMPREHENSIVE_DESIGN_5: 'c4b45454-5454-5454-5454-545454545454',
};

// UUIDs for Users
const USER_IDS = {
    ALICE: 'u1a11111-1111-1111-1111-111111111111',
    BOB: 'u1a22222-2222-2222-2222-222222222222',
    CHARLIE: 'u1a33333-3333-3333-3333-333333333333',
};

// UUIDs for Notes
const NOTE_IDS = {
    NOTE1: 'n1a55555-5555-5555-5555-555555555555',
    NOTE2: 'n1a66666-6666-6666-6666-666666666666',
    NOTE3: 'n1a77777-7777-7777-7777-777777777777',
    NOTE4: 'n1a88888-8888-8888-8888-888888888888',
};

// ========================
// Course Mocks
// ========================

const courses = [
    // 1st Year, 1st Semester
    {
        id: COURSE_IDS.PROGRAMMING_INTRO,
        year: 2024,
        grade: 1,
        semester: 1,
        title: '프로그래밍입문',
        professorName: '이동희',
    },
    {
        id: COURSE_IDS.COMPUTER_SCIENCE_INTRO,
        year: 2024,
        grade: 1,
        semester: 1,
        title: '컴퓨터과학개론',
        professorName: '황혜수',
    },

    // 1st Year, 2nd Semester
    {
        id: COURSE_IDS.C_LANGUAGE_LAB_1,
        year: 2024,
        grade: 1,
        semester: 2,
        title: 'C언어및실습',
        professorName: '김성환',
    },
    {
        id: COURSE_IDS.C_LANGUAGE_LAB_2,
        year: 2024,
        grade: 1,
        semester: 2,
        title: 'C언어및실습',
        professorName: '남현우',
    },
    {
        id: COURSE_IDS.CREATIVE_ENGINEERING_DESIGN,
        year: 2024,
        grade: 1,
        semester: 2,
        title: '창의공학기초설계',
        professorName: '노창배',
    },

    // 2nd Year, 1st Semester
    {
        id: COURSE_IDS.OBJECT_ORIENTED_PROGRAMMING_LAB_1,
        year: 2024,
        grade: 2,
        semester: 1,
        title: '객체지향프로그래밍및실습',
        professorName: '김영직',
    },
    {
        id: COURSE_IDS.DISCRETE_MATHEMATICS,
        year: 2024,
        grade: 2,
        semester: 1,
        title: '이산수학',
        professorName: '정형구',
    },
    {
        id: COURSE_IDS.CONTENTS_STARTUP,
        year: 2024,
        grade: 2,
        semester: 1,
        title: '콘텐츠창업실무',
        professorName: '김성환',
    },
    {
        id: COURSE_IDS.OBJECT_ORIENTED_PROGRAMMING_LAB_2,
        year: 2024,
        grade: 2,
        semester: 1,
        title: '객체지향프로그래밍및실습',
        professorName: '유하진',
    },
    {
        id: COURSE_IDS.PROBABILITY_AND_STATISTICS,
        year: 2024,
        grade: 2,
        semester: 1,
        title: '확률과통계',
        professorName: '유하진',
    },
    {
        id: COURSE_IDS.MULTIMEDIA_APPLICATION,
        year: 2024,
        grade: 2,
        semester: 1,
        title: '멀티미디어응용',
        professorName: '김성환',
    },
    {
        id: COURSE_IDS.LOGIC_CIRCUIT_LAB,
        year: 2024,
        grade: 2,
        semester: 1,
        title: '논리회로및실습',
        professorName: '김민호',
    },
    {
        id: COURSE_IDS.LINEAR_ALGEBRA,
        year: 2024,
        grade: 2,
        semester: 1,
        title: '선형대수',
        professorName: '김민호',
    },

    // 2nd Year, 2nd Semester
    {
        id: COURSE_IDS.DATA_STRUCTURES,
        year: 2024,
        grade: 2,
        semester: 2,
        title: '자료구조',
        professorName: '송영록',
    },
    {
        id: COURSE_IDS.PROGRAMMING_LANGUAGE_THEORY,
        year: 2024,
        grade: 2,
        semester: 2,
        title: '프로그래밍언어론',
        professorName: '김지은',
    },
    {
        id: COURSE_IDS.INTERNET_PROGRAMMING_LAB,
        year: 2024,
        grade: 2,
        semester: 2,
        title: '인터넷프로그래밍및실습',
        professorName: '추칠엽',
    },
    {
        id: COURSE_IDS.DATA_COMMUNICATION,
        year: 2024,
        grade: 2,
        semester: 2,
        title: '데이터통신',
        professorName: '안상현',
    },
    {
        id: COURSE_IDS.NUMERICAL_ANALYSIS,
        year: 2024,
        grade: 2,
        semester: 2,
        title: '수치해석',
        professorName: '김민호',
    },
    {
        id: COURSE_IDS.UNIX_PROGRAMMING,
        year: 2024,
        grade: 2,
        semester: 2,
        title: '유닉스프로그래밍',
        professorName: '이동희',
    },

    // 3rd Year, 1st Semester
    {
        id: COURSE_IDS.FILE_PROCESSING_THEORY,
        year: 2024,
        grade: 3,
        semester: 1,
        title: '화일처리론',
        professorName: '박찬길',
    },
    {
        id: COURSE_IDS.COMPUTER_COMMUNICATION,
        year: 2024,
        grade: 3,
        semester: 1,
        title: '컴퓨터통신',
        professorName: '안상현',
    },
    {
        id: COURSE_IDS.COMPUTER_ALGORITHMS,
        year: 2024,
        grade: 3,
        semester: 1,
        title: '컴퓨터알고리즘',
        professorName: '김진석',
    },
    {
        id: COURSE_IDS.WINDOWS_PROGRAMMING,
        year: 2024,
        grade: 3,
        semester: 1,
        title: '윈도우즈프로그래밍',
        professorName: '이동희',
    },
    {
        id: COURSE_IDS.OPERATING_SYSTEMS,
        year: 2024,
        grade: 3,
        semester: 1,
        title: '운영체제',
        professorName: '이동희',
    },
    {
        id: COURSE_IDS.COMPUTER_ARCHITECTURE,
        year: 2024,
        grade: 3,
        semester: 1,
        title: '컴퓨터구조론',
        professorName: '송영록',
    },
    {
        id: COURSE_IDS.COMPUTER_SECURITY,
        year: 2024,
        grade: 3,
        semester: 1,
        title: '컴퓨터보안',
        professorName: '최혁',
    },

    // 3rd Year, 2nd Semester
    {
        id: COURSE_IDS.DATABASE,
        year: 2024,
        grade: 3,
        semester: 2,
        title: '데이터베이스',
        professorName: '홍의경',
    },
    {
        id: COURSE_IDS.ARTIFICIAL_INTELLIGENCE,
        year: 2024,
        grade: 3,
        semester: 2,
        title: '인공지능',
        professorName: '이경재',
    },
    {
        id: COURSE_IDS.SOFTWARE_APPLICATION,
        year: 2024,
        grade: 3,
        semester: 2,
        title: '소프트웨어응용',
        professorName: '황혜수',
    },
    {
        id: COURSE_IDS.SOFTWARE_ENGINEERING,
        year: 2024,
        grade: 3,
        semester: 2,
        title: '소프트웨어공학',
        professorName: '김지은',
    },
    {
        id: COURSE_IDS.EMBEDDED_SYSTEM_DESIGN,
        year: 2024,
        grade: 3,
        semester: 2,
        title: '임베디드시스템설계',
        professorName: '이동희',
    },
    {
        id: COURSE_IDS.MICROPROCESSOR_DESIGN_LAB,
        year: 2024,
        grade: 3,
        semester: 2,
        title: '마이크로프로세서설계및실습',
        professorName: '최혁',
    },

    // 4th Year, 1st Semester
    {
        id: COURSE_IDS.MULTIPROCESSOR_COMPUTING,
        year: 2024,
        grade: 4,
        semester: 1,
        title: '멀티프로세서컴퓨팅',
        professorName: '노창배',
    },
    {
        id: COURSE_IDS.WEB_INFORMATION_SYSTEM,
        year: 2024,
        grade: 4,
        semester: 1,
        title: '웹정보시스템',
        professorName: '황헤수',
    },
    {
        id: COURSE_IDS.COMPUTER_SCIENCE_COMPREHENSIVE_DESIGN_1,
        year: 2024,
        grade: 4,
        semester: 1,
        title: '컴퓨터과학종합설계',
        professorName: '최혁',
    },
    {
        id: COURSE_IDS.COMPUTER_SCIENCE_COMPREHENSIVE_DESIGN_2,
        year: 2024,
        grade: 4,
        semester: 1,
        title: '컴퓨터과학종합설계',
        professorName: '김진석',
    },
    {
        id: COURSE_IDS.COMPUTER_SCIENCE_COMPREHENSIVE_DESIGN_3,
        year: 2024,
        grade: 4,
        semester: 1,
        title: '컴퓨터과학종합설계',
        professorName: '황혜수',
    },
    {
        id: COURSE_IDS.DEEP_LEARNING_APPLICATIONS,
        year: 2024,
        grade: 4,
        semester: 1,
        title: '딥러닝실제와응용',
        professorName: '이경재',
    },
    {
        id: COURSE_IDS.DATABASE_DESIGN,
        year: 2024,
        grade: 4,
        semester: 1,
        title: '데이터베이스설계',
        professorName: '홍의경',
    },

    // 4th Year, 2nd Semester
    {
        id: COURSE_IDS.SMART_FINANCE_INTRO,
        year: 2024,
        grade: 4,
        semester: 2,
        title: '스마트금융개론',
        professorName: '김성환',
    },
    {
        id: COURSE_IDS.COMPUTER_SCIENCE_COMPREHENSIVE_DESIGN_4,
        year: 2024,
        grade: 4,
        semester: 2,
        title: '컴퓨터과학종합설계',
        professorName: '김진석',
    },
    {
        id: COURSE_IDS.COMPUTER_GRAPHICS,
        year: 2024,
        grade: 4,
        semester: 2,
        title: '컴퓨터그래픽스',
        professorName: '김민호',
    },
    {
        id: COURSE_IDS.NETWORK_SECURITY,
        year: 2024,
        grade: 4,
        semester: 2,
        title: '네트워크보안',
        professorName: '안상현',
    },
    {
        id: COURSE_IDS.COMPUTER_SCIENCE_COMPREHENSIVE_DESIGN_5,
        year: 2024,
        grade: 4,
        semester: 2,
        title: '컴퓨터과학종합설계',
        professorName: '최혁',
    },
];

// ========================
// User Mocks
// ========================

const users = [
    {
        id: USER_IDS.ALICE,
        email: 'alice@uos.ac.kr',
        passwordHash: 'hashedpassword123',
        username: 'alice123',
        point: 0,
        accessibleNoteIDs: [],
    },
    {
        id: USER_IDS.BOB,
        email: 'bob@uos.ac.kr',
        passwordHash: 'hashedpassword456',
        username: 'bob456',
        point: 2,
        accessibleNoteIDs: [NOTE_IDS.NOTE1, NOTE_IDS.NOTE2],
    },
    {
        id: USER_IDS.CHARLIE,
        email: 'charlie@uos.ac.kr',
        passwordHash: 'hashedpassword789',
        username: 'charlie789',
        point: 5,
        accessibleNoteIDs: [NOTE_IDS.NOTE1, NOTE_IDS.NOTE3, NOTE_IDS.NOTE4],
    },
];

// ========================
// Note Mocks
// ========================

const notes = [
    {
        id: NOTE_IDS.NOTE1,
        uploadDate: new Date('2024-04-15'),
        uploaderID: USER_IDS.ALICE,
        courseID: COURSE_IDS.PROGRAMMING_INTRO,
        title: '프로그래밍입문 노트',
        description: '프로그래밍입문 강의에 대한 노트입니다.',
        previewURL: 'https://example.com/preview/note1',
        fileURL: 'https://example.com/files/note1.pdf',
        likesCount: 25,
        dislikesCount: 2,
    },
    {
        id: NOTE_IDS.NOTE2,
        uploadDate: new Date('2024-05-20'),
        uploaderID: USER_IDS.BOB,
        courseID: COURSE_IDS.COMPUTER_SCIENCE_INTRO,
        title: '컴퓨터과학개론 노트',
        description: '컴퓨터과학개론 강의 노트와 요약입니다.',
        previewURL: 'https://example.com/preview/note2',
        fileURL: 'https://example.com/files/note2.pdf',
        likesCount: 30,
        dislikesCount: 1,
    },
    {
        id: NOTE_IDS.NOTE3,
        uploadDate: new Date('2024-06-10'),
        uploaderID: USER_IDS.CHARLIE,
        courseID: COURSE_IDS.C_LANGUAGE_LAB_1,
        title: 'C언어및실습 노트',
        description: 'C언어 노트입니다.',
        previewURL: 'https://example.com/preview/note3',
        fileURL: 'https://example.com/files/note3.pdf',
        likesCount: 15,
        dislikesCount: 0,
    },
    {
        id: NOTE_IDS.NOTE4,
        uploadDate: new Date('2024-07-05'),
        uploaderID: USER_IDS.CHARLIE,
        courseID: COURSE_IDS.C_LANGUAGE_LAB_1,
        title: 'C언어및실습 노트 2',
        description: '추가적인 C언어 노트입니다.',
        previewURL: 'https://example.com/preview/note4',
        fileURL: 'https://example.com/files/note4.pdf',
        likesCount: 20,
        dislikesCount: 3,
    },
];

// ========================
// Exporting Mocks (Optional)
// ========================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        COURSE_IDS,
        USER_IDS,
        NOTE_IDS,
        courses,
        users,
        notes,
    };
}