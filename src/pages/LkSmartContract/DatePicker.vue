<template>
    <v-row class="wrapper d-flex ">
        <v-col>
            <v-menu
                ref="menu1"
                v-model="menu1"
                :close-on-content-click="false"
                lazy
                transition="scale-transition"
                offset-y
                full-width
            >
            <template v-slot:activator="{ on }">
                <v-text-field
                    v-model="dateFormatted"
                    readonly
                    v-on="on"
                    solo
                    background-color="#4d3779"
                    height="56px"
                    label="From"
                    @blur="date = parseDate(dateFormatted)"
                />
            </template>
                <v-date-picker v-model="date" @input="menu1" :weekday-format="getDay" no-title scrollable></v-date-picker>
            </v-menu>
        </v-col>
        <v-col>
            <v-menu
                ref="menu2"
                v-model="menu2"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                lazy
            >
            <template v-slot:activator="{ on }">
                <v-text-field
                    v-model="dateFormattedAnother"
                    readonly
                    v-on="on"
                    solo
                    background-color="#4d3779"
                    height="56px"
                    label="Before"
                    @blur="dateAnother = parseDateAnother(dateFormattedAnother)"
                />
            </template>
                <v-date-picker v-model="dateAnother" @input="menu2" :weekday-format="getDay" no-title scrollable></v-date-picker>
            </v-menu>
        </v-col>
    </v-row>
</template>
<script>
    export default {
        data: vm => ({
            daysOfWeek: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
            date: new Date().toISOString().substr(0, 10),
            dateFormatted: this.label,
            // vm.formatDate(new Date().toISOString().substr(0, 10))
            menu1: false,
            dateAnother: new Date().toISOString().substr(0, 10),
            dateFormattedAnother: this.label,
            menu2: false,
            }),
             watch: {
                date (val) {
                    this.dateFormatted = this.formatDate(this.date)
                },
                dateAnother (val) {
                    this.dateFormattedAnother = this.formatDateAnother(this.dateAnother)
                }
            },
            methods: {
                formatDate (date) {
                    if (!date) return null
                    const [year, month, day] = date.split('-')
                    return `${day}.${month}.${year}`
                },
                formatDateAnother (dateAnother) {
                    if (!dateAnother) return null
                    const [year, month, day] = dateAnother.split('-')
                    return `${day}.${month}.${year}`
                },
                parseDate (date) {
                    if (!date) return null
                    const [month, day, year] = date.split('/')
                    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
                },
                parseDateAnother (dateAnother) {
                    if (!dateAnother) return null
                    const [month, day, year] = dateAnother.split('/')
                    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
                },
                getDay (date) {
                    const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
                    let i = new Date(date).getDay(date)
                    return daysOfWeek[i]
                },
            }
    }
</script>
<style lang="scss" scoped>
    .wrapper {
        display: grid;
        grid-gap: 15px;
    }
</style>
