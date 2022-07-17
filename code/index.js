function validator (options) {
    var formValidation = document.querySelector(options.form)

    function validateAll () {
        options.rules.forEach(function (rule) {
            var inputElement = document.querySelector(rule.selector)
            validate(inputElement,rule)
        })
    }
    function getParentElement (inputElement,selector) {
        while(inputElement.parentElement) {
            if (inputElement.parentElement.matches(selector)) {
                return inputElement.parentElement
            }
            inputElement = inputElement.parentElement
        }
    }
    function validate(inputElement,rule) {
        var rules = selectorRules[rule.selector]
        var errorElement = getParentElement(inputElement,options.formGroup).querySelector('.form--message')
        var errorMessage 
        
        for (let i = 0;i < rules.length; i++) {
            
            switch (inputElement.type) {
                case 'checkbox':
                case 'radio':
                    errorMessage = rules[i](formValidation.querySelector(rule.selector + ':checked'))
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break;
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage
            getParentElement(inputElement,options.formGroup).classList.add('invalid')
        } else {
            errorElement.innerText = ''
            getParentElement(inputElement,options.formGroup).classList.remove('invalid')
        }

        return !errorMessage
    }
    var selectorRules = {}
    if (formValidation) {
        options.rules.forEach(function (rule) {
            
            var inputElements = formValidation.querySelectorAll(rule.selector)
            Array.from(inputElements).forEach(function (inputElement) {
                inputElement.onblur = function () {
                    validate(inputElement,rule)
                }

                inputElement.oninput = function () {
                    var errorElement = getParentElement(inputElement,options.formGroup).querySelector('.form--message')
                    errorElement.innerText = ''
                    getParentElement(inputElement,options.formGroup).classList.remove('invalid')
                }
            })

            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }
        })
    }
    let formValid = true;

    formValidation.onsubmit = function (e) {
        e.preventDefault()

        validateAll()

        options.rules.forEach(function (rule) {
            var inputElement = formValidation.querySelector(rule.selector)
            var valid = validate(inputElement,rule)
            console.log(valid)
            if (valid === true) {
                formValid = false
            }
            console.log(formValid)
        })

        if (formValid === false) {
            var enableInput = document.querySelectorAll('input:not(disabled)')
            var select = document.querySelectorAll('select')
    
            var enableData = Array.from(enableInput).concat(Array.from(select))
            
            if (typeof options.submitData === 'function') {
                var valueInput = enableData.reduce(function (value,input) {
                    switch (input.type) {
                        case 'radio':
                            value[input.name] = document.querySelector('input[type="radio"]:checked')
                            break;
                        case 'checkbox':
                            if (!input.matches('checked')) return value
                            
                            if (!Array.isArray(input.name)) {
                                value[input.name] = []
                            }
                            value[input.name].push(input.value)
                            break;
                        case 'file': 
                        value[input.name] = []
                        value[input.name].push(input.value)
                        break;
                        default :
                        value[input.name] = input.value;
                    }
                    return value
                },{})
                options.submitData(valueInput)
            }
        }
    }
    

}


validator.isRequired = function (selector,message) {
    return {
        selector: selector,
        test (value) {
            return value ? undefined : message || 'Please type in this box'
        }
    }
}

validator.isEmail = function (selector,message) {
    return {
        selector: selector,
        test(value) {
            const regrexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regrexEmail.test(value) ? undefined : message || 'Please type in this box'
        }
    }
}

validator.isMinLength = function (selector,min,message) {
    return {
        selector: selector,
        test(value) {
            return value.length >= min ? undefined : message || 'Please type in this box'
        }
    }
}

validator.isConfirmed = function (selector,confirmValue,message) {
    return {
        selector: selector,
        test (value) {
            return value === confirmValue() ? undefined : message || 'please type in this box'
        }
    }
}