function validator (formSelector) {
    const this_ = this

    function getParentElement (input,selector) {
        while(input.parentElement) {
            if (input.parentElement.matches(selector)) {
                return input.parentElement
            }
            input = input.parentElement
        }
    }
    var messageInerror = {
        name: 'Please type in the box',
        email: 'Please type a correct email',
        min: 'Please type enough charaters',
        max: 'Please not type over 12 charaters',
        gender: 'Please type in the box',
        Province: 'Please type in the box'
    }

    var formElement = document.querySelector(formSelector)
    var formRules = {}
    var validatorRules = {
        required (value,message) {
            return value ? undefined : message || 'Please type in this box'
        },
        email (value,message) {
            var regrexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regrexEmail.test(value) ? undefined : message || 'Please type your correct email'
        },
        min (min) {
            return function (value,message) {
                return value.length >= min ? undefined : message || 'Please type enough charaters'
            }
        },
        max (max) {
            return function (value,message) {
                return value.length <= max ? undefined : message || `Please not type over ${max} password`
            }
        },
        passwordConfirmation (value,message) {
            var confirmValue = document.querySelector('#password').value
            return value === confirmValue ? undefined : message || 'Please confirm your password'
        }
    } 

    var inputElements = document.querySelectorAll('input[name][rules]')
    var selectElements = document.querySelectorAll('select[name][rules]')
    var informElements= Array.from(inputElements).concat(Array.from(selectElements))

    if (formElement) {
        // loop for index
        for (var input of informElements) {
            var rules = input.getAttribute('rules').split('|')
            for (var rule of rules) {
                var specialRules = rule.includes(':')
                var detailRules;
                var ruleInfo
                if (specialRules) {
                    ruleInfo = rule.split(':')
                    rule = ruleInfo[0]
                }
                // check rules and save
                if (specialRules) {
                    detailRules = validatorRules[rule](ruleInfo[1])
                } else {
                    detailRules = validatorRules[rule]
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(detailRules)
                } else {
                    formRules[input.name] = [detailRules]
                }
                // onblur and onchange event
                    input.onblur = handleValidate;
                    input.oninput = removeValidate;
                    formElement.onsubmit = validateAll;     
                
            }
            function validateAll (e) {
                var valueInput = informElements.reduce(function (value,input) {
                    switch (input.type) {
                        case 'radio':
                            value[input.name] = formElement.querySelector('input[type="radio"]:checked')
                        break;
                        case 'checkbox': 
                            if (!input.matches('checked')) return value

                            if (!Array.isArray(input.name)) {
                                value[input.name] = []
                            } else {
                                value[input.name].push(input.value)
                            }
                        break;
                        case 'file':
                            value[input.name] = []
                            value[input.name].push(input.value)
                        break;
                        default: 
                            value[input.name] = input.value
                    }
                    return value
                },{})
                e.preventDefault()

                var isValid = true 
                for (var input of informElements) {
                    if (!handleValidate({target : input})) {
                        isValid = false
                    }
                }
                if (isValid === false) {
                    if (typeof this_.onSubmit === 'function') {
                        
                    this_.onSubmit(valueInput)
                    } else {
                        formElement.submit()
                    }
                }
            }

            function removeValidate (e) {
                var formGroup = getParentElement(e.target,'.form--group')
                if (formGroup.classList.contains('invalid')) {
                    if (formGroup) {
                        var errorElement = formGroup.querySelector('.form--message')
                        formGroup.classList.remove('invalid')
                        errorElement.innerText = ''
                    }
                }
            }

            function handleValidate (e) {
                var rules = formRules[e.target.name]
                var errorMessage;
                var errorElement = getParentElement(e.target,'.form--group').querySelector('.form--message')
                for (var i = 0; i<rules.length;i++) {
                    switch (input.type) {
                        case 'checkbox':
                        case 'radio':
                            errorMessage = rules[i](e.target.name + ':checked')
                        break;

                        default:
                        var message = e.target.name
                        errorMessage = rules[i](e.target.value,messageInerror[message])
                    }
                    if (errorMessage) break;
                }
                var formGroup = getParentElement(e.target,'.form--group')
                if (errorMessage) {
                    if (formGroup) {
                        errorElement.innerText = errorMessage
                        formGroup.classList.add('invalid')
                    }
                } else {
                    errorElement.innerText = ''
                    formGroup.classList.remove('invalid')
                }
            }
              
        }
        
    }
}
