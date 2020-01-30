<template>
    <v-row class="wrapper d-flex ">
        <v-col>
            <v-menu
                v-model="menu1"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="290px"
            >
            <template v-slot:activator="{ on }">
                <v-text-field
                    v-model="dates[0]"
                    readonly
                    v-on="on"
                    solo
                    background-color="#4d3779"
                    height="56px"
                />
            </template>
                <v-date-picker v-model="dates[0]" @input="menu1" range no-title></v-date-picker>
            </v-menu>
        </v-col>
        <v-col>
            <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
            >
            <template v-slot:activator="{ on }">
                <v-text-field
                    v-model="dates[1]"
                    readonly
                    v-on="on"
                    solo
                    background-color="#4d3779"
                    height="56px"
                />
            </template>
                <v-date-picker v-model="dates[1]" @input="menu2" range no-title></v-date-picker>
            </v-menu>
        </v-col>
    </v-row>
</template>
<script>
    export default {
        data: () => ({
            dates: ['28.09.2019', '31.09.2019'],
            date: new Date().toISOString().substr(0, 10),
            menu1: false,
            menu2: false,
            dialog: false,
            }),
            computed: {
                dateRangeText () {
                    return this.dates.join(' ~ ')
                },
            },
    }
</script>
<style lang="scss" scoped>
    .wrapper {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        grid-gap: 15px;
    }
</style>