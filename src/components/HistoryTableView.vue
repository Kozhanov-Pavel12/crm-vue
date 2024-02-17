<template>
  <table>
    <thead>
      <tr>
        <th>№</th>
        <th>{{ localizeFilter("Total") }}</th>
        <th>{{ localizeFilter("Date") }}</th>
        <th>{{ localizeFilter("Category") }}</th>
        <th>{{ localizeFilter("Type") }}</th>
        <th>{{ localizeFilter("Open") }}</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(record, idx) of records" :key="record.id">
        <td>{{ idx + 1 }}</td>
        <td>{{ currencyFilter(record.amount) }}</td>
        <td>{{ new Date(record.date).toLocaleDateString() }}</td>
        <td>{{ record.categoryName }}</td>
        <td>
          <span class="white-text badge" :class="[record.typeClass]">{{
            record.typeText
          }}</span>
        </td>
        <td>
          <button
            class="btn-small btn"
            v-tooltip="'Открыть запись'"
            @click="$router.push('/detail/' + record.id)"
          >
            <i class="material-icons">open_in_new</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import currencyFilter from "@/utils/currencyFilter";
import dateFilter from "@/utils/dateFilter";
import localizeFilter from "@/utils/localizeFilter";
export default {
  props: {
    records: {
      required: true,
      type: Array,
    },
  },
  methods: {
    currencyFilter,
    dateFilter,
    localizeFilter,
  },
};
</script>
