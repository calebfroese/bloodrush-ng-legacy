export class FormConfig {
    /**
     * Stores any additional data that may be required when
     * creating forms.
     */
    password = {
        min: 4
    };
    username = {
        min: 3,
        max: 15
    };
    teamName = {
        min: 3,
        max: 15
    };
    acronym = {
        min: 2,
        max: 4
    };
}
