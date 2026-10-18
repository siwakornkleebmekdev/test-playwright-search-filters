*** Settings ***
Library    Browser    timeout=10s

*** Variables ***
${BASE_URL}              %{BASE_URL=https://share-ed.online}
${HEADLESS}              %{HEADLESS=true}
${SEARCH_INPUT}          css=input[placeholder^="ค้นหา"]
${POST_CARDS}            css=div.group.cursor-pointer, .grid > div.group, .flex.flex-col > div.group
${FIRST_POST}            ${POST_CARDS} >> nth=0
${EMPTY_STATE}           text="ไม่พบโพสต์ที่ตรงกับตัวกรอง"
${CLEAR_FILTERS_BUTTON}  role=button[name="ล้างตัวกรองทั้งหมด"]
${GRID_VIEW_BUTTON}      css=button[title="Grid View"]
${LIST_VIEW_BUTTON}      css=button[title="List View"]

*** Keywords ***
Open Explore Browser
    ${headless}=    Convert To Boolean    ${HEADLESS}
    New Browser    chromium    headless=${headless}
    New Context    viewport={'width': 1280, 'height': 720}    ignoreHTTPSErrors=${TRUE}
    New Page    about:blank

Open Explore Page
    Go To    ${BASE_URL}/explore
    Wait For Elements State    ${SEARCH_INPUT}    visible    timeout=30s
    Wait For Elements State    ${FIRST_POST}    visible    timeout=30s

Search For
    [Arguments]    ${keyword}
    Fill Text    ${SEARCH_INPUT}    ${keyword}

Filter Checkbox
    [Arguments]    ${filter_name}
    ${checkbox}=    Set Variable    xpath=//label[contains(normalize-space(.), "${filter_name}")]//input[@type="checkbox"]
    RETURN    ${checkbox}

Select Filter
    [Arguments]    ${filter_name}
    ${checkbox}=    Filter Checkbox    ${filter_name}
    Check Checkbox    ${checkbox}

Unselect Filter
    [Arguments]    ${filter_name}
    ${checkbox}=    Filter Checkbox    ${filter_name}
    Uncheck Checkbox    ${checkbox}

Filter Should Be Unchecked
    [Arguments]    ${filter_name}
    ${checkbox}=    Filter Checkbox    ${filter_name}
    ${checked}=    Get Property    ${checkbox}    checked
    Should Be Equal    ${checked}    ${FALSE}

Post Count Should Be Greater Than Zero
    ${count}=    Get Element Count    ${POST_CARDS}
    Should Be True    ${count} > 0

First Post Should Contain
    [Arguments]    ${expected}
    Wait For Elements State    ${FIRST_POST}    visible
    ${text}=    Get Text    ${FIRST_POST}
    Should Contain    ${text}    ${expected}

Search Value Should Be
    [Arguments]    ${expected}
    ${value}=    Get Property    ${SEARCH_INPUT}    value
    Should Be Equal    ${value}    ${expected}

Clear All Filters
    Click    ${CLEAR_FILTERS_BUTTON}
    Search Value Should Be    ${EMPTY}
    Wait For Elements State    ${FIRST_POST}    visible
