// Angular imports
import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

// Custom imports
import { FormConfig } from './form.config';
import { CustomValidators } from './custom-validators';

@Injectable()
export class FormService {
    /**
     * Used to create forms to be used for markets and traders
     */

    // Account
    email = ['',
        Validators.compose([
            Validators.required,
            CustomValidators.isRaw('isEmail')
        ])
    ];
    password = ['',
        Validators.compose([
            Validators.required,
            Validators.minLength(this.formConfig.password.min)
        ])
    ];
    username = ['',
        Validators.compose([
            Validators.required,
            Validators.minLength(this.formConfig.username.min),
            Validators.maxLength(this.formConfig.username.max)
        ])
    ];
    // Team
    acronym = ['',
        Validators.compose([
            Validators.required,
            Validators.minLength(this.formConfig.acronym.min),
            Validators.maxLength(this.formConfig.acronym.max)
        ])
    ];
    teamName = ['',
        Validators.compose([
            Validators.required,
            Validators.minLength(this.formConfig.teamName.min),
            Validators.maxLength(this.formConfig.teamName.max)
        ])
    ];

    constructor(
        private fb: FormBuilder,
        private formConfig: FormConfig
    ) { }

    signupForm(): any {
        return this.fb.group(
            {
                email: this.email,
                emailConf: this.email,
                password: this.password,
                passwordConf: this.password,
                username: this.username,
                acronym: this.acronym,
                teamName: this.teamName
            },
            {
                validator: Validators.compose([
                    CustomValidators.fieldsMatch('email', 'emailConf'),
                    CustomValidators.fieldsMatch('password', 'passwordConf')
                ])
            }
        );
    }
}
