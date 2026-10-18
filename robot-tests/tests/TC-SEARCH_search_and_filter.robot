*** Settings ***
Documentation     Test Scenario: ระบบค้นหาและกรองโพสต์
Resource          ../resources/search.resource
Suite Setup       Open Explore Browser
Suite Teardown    Close Browser
Test Setup        Open Explore Page
Test Tags         e2e    search    chromium

*** Variables ***
${POSITIVE_KEYWORD}     ฟิสิกส์
${COMBINED_KEYWORD}     สรุปสูตรฟิสิกส์
${NOT_FOUND_KEYWORD}    @
${JUNIOR_HIGH}          มัธยมศึกษาตอนต้น
${SENIOR_HIGH}          มัธยมศึกษาตอนปลาย
${UNIVERSITY}           มหาวิทยาลัย

*** Test Cases ***
TC-SEARCH-01: Search Posts Successfully
    [Tags]    TC-SEARCH-01
    Search For    ${POSITIVE_KEYWORD}
    First Post Should Contain    ${POSITIVE_KEYWORD}
    Search Value Should Be    ${POSITIVE_KEYWORD}

TC-SEARCH-02: Filter Posts By Education Level
    [Tags]    TC-SEARCH-02
    Select Filter    ${JUNIOR_HIGH}
    Post Count Should Be Greater Than Zero
    First Post Should Contain    ${JUNIOR_HIGH}

TC-SEARCH-03: Display Search Results
    [Tags]    TC-SEARCH-03
    Post Count Should Be Greater Than Zero
    ${first_title}=    Get Text    ${FIRST_POST} >> css=h3
    Should Not Be Empty    ${first_title}

TC-SEARCH-04: Show Empty State And Clear Filters
    [Tags]    TC-SEARCH-04
    Search For    ${NOT_FOUND_KEYWORD}
    Wait For Elements State    ${EMPTY_STATE}    visible
    Get Element Count    ${POST_CARDS}    ==    0
    Wait For Elements State    ${CLEAR_FILTERS_BUTTON}    visible
    Clear All Filters
    Post Count Should Be Greater Than Zero

TC-SEARCH-05: Combine Search And Education Filter
    [Tags]    TC-SEARCH-05
    Search For    ${COMBINED_KEYWORD}
    Select Filter    ${SENIOR_HIGH}
    First Post Should Contain    ${COMBINED_KEYWORD}
    First Post Should Contain    ${SENIOR_HIGH}
    Get Element Count    ${POST_CARDS}    ==    1

TC-SEARCH-06: Switch To List View
    [Tags]    TC-SEARCH-06
    ${initial_count}=    Get Element Count    ${POST_CARDS}
    Click    ${LIST_VIEW_BUTTON}
    Wait For Elements State    css=.flex-1 > .flex.flex-col.gap-4    visible
    Get Element Count    ${POST_CARDS}    ==    ${initial_count}

TC-SEARCH-07: Uncheck One Of Multiple Filters
    [Tags]    TC-SEARCH-07
    Select Filter    ${JUNIOR_HIGH}
    Select Filter    ${UNIVERSITY}
    Unselect Filter    ${JUNIOR_HIGH}
    First Post Should Contain    ${UNIVERSITY}

TC-SEARCH-08: Uncheck The Last Education Filter
    [Tags]    TC-SEARCH-08
    ${initial_count}=    Get Element Count    ${POST_CARDS}
    Select Filter    ${JUNIOR_HIGH}
    Unselect Filter    ${JUNIOR_HIGH}
    Get Element Count    ${POST_CARDS}    ==    ${initial_count}

TC-SEARCH-09: Clear All Filters From Empty State
    [Tags]    TC-SEARCH-09
    ${initial_count}=    Get Element Count    ${POST_CARDS}
    Search For    ${NOT_FOUND_KEYWORD}
    Wait For Elements State    ${EMPTY_STATE}    visible
    Clear All Filters
    Filter Should Be Unchecked    ${JUNIOR_HIGH}
    Filter Should Be Unchecked    ${SENIOR_HIGH}
    Filter Should Be Unchecked    ${UNIVERSITY}
    Get Element Count    ${POST_CARDS}    ==    ${initial_count}
