function validator (selector) {
    const this_ = this

    function getParentElement (input,selector) {
        while (input.parentElement) {
            if (input.parentElement.matches(selector)) {
                return input.parentElement
            }
            input = input.parentElement
        }
    }

    var messageError = {
        name: 'Please type your full name',
        email: 'Please type a correct email',
        min: 'Please type enough characters',
        confirm: 'Please type your correct password',
        gender: 'Please choose your gender',
        province: 'Please type your province'
    }

    var formElement = document.querySelector(selector)
    var formRules = {}
    var validatorRules = {
        required (value,message) {
            return value ? undefined : message || 'Please fill in this box'
        },
        email (value,message) {
            var regrexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regrexEmail.test(value) ? undefined : message || 'Please fill in this box'
        },
        min (min) {
            return function (value,message) {
                return value.length >= min ? undefined : message || 'Please fill in this box'
            }
        },
        max (max) {
            return function (value,message) {
                return value.length <= max ? undefined : message || 'Please fill in this box'
            }
        },
        confirm (value,message) {
            var valueConfirm = document.querySelector('#password').value
            return valueConfirm === value ? undefined : message || 'Please fill in this box'
        }
    }

    var inputElement = formElement.querySelectorAll('input[name][rules]')
    var selectElement = formElement.querySelectorAll('select[name]')
    var infoElement = Array.from(inputElement).concat(Array.from(selectElement))

    if (formElement) {
        // loop input of all input
        for (var input of infoElement) {
            var rules = input.getAttribute('rules').split('|')
            // loop all rule
            for (var rule of rules) {
                var specialRules = rule.includes(':')
                var detailRules;
                var normalRules;
                if (specialRules === true) {
                    normalRules = rule.split(':')
                    rule = normalRules[0]
                    console.log(normalRules[1])
                }

                // check rules and save
                if (specialRules === true) {
                    detailRules = validatorRules[rule](normalRules[1])
                } else {
                    detailRules = validatorRules[rule]
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(detailRules)
                } else {
                    formRules[input.name] = [detailRules]
                }
                // main event handle
                input.onblur = handleValidate;
                input.oninput = removeValidate;
                input.onsubmit = validateOnSubmit;
            }

            function handleValidate (e) {
                var errorElement = getParentElement(e.target,'.form--group').querySelector('.form--message')
                var errorMessage;
                var rules = formRules[e.target.name]
                console.log(rules)
                for (var i = 0 ; i < rules.length; i++) {
                    switch (input.type) {
                        case 'checkbox':
                        case 'radio':
                            errorMessage = rules[i](e.target.name + 'checked')
                        break;
                        default:
                            var messageName = e.target.name
                            console.log(e.target.value)
                            errorMessage = rules[i](e.target.value,messageError[messageName])
                            console.log(errorMessage)
                    }
                    if (errorMessage) break;
                }
                var formGroup = getParentElement(e.target,'.form--group');
            
                if (errorMessage) {
                    errorElement.textContent = errorMessage
                    formGroup.classList.add('invalid')
                } else {
                    errorElement.textContent = ''
                    formGroup.classList.remove('invalid')
                }
            }

            function removeValidate (e) {
                var formGroup = getParentElement(e.target,'.form--group');
                if (formGroup.classList.contains('invalid')) {
                    if (formGroup) {
                        var errorElement = getParentElement(e.target,'.form--group').querySelector('.form--message')
                        formGroup.classList.remove('invalid')
                        errorElement.textContent = ''
                    }
                }
            }

            function validateOnSubmit (e) {
                e.preventDefault()
                console.log('123')
            }
        }
    }
    console.log(formRules)

}