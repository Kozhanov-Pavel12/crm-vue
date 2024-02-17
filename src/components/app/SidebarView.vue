<template>
  <ul class="sidenav app-sidenav" :class="{ open: isSidebar }">
    <router-link
      v-for="link of links"
      :key="link.url"
      active-class="active"
      :to="link.url"
      v-slot="{ href, isActive }"
    >
      <li :class="[isActive && 'router-link-active']">
        <a :href="href" class="waves-effect waves-orange pointer">{{
          link.title
        }}</a>
      </li>
    </router-link>
  </ul>
</template>

<script>
import localizeFilter from "@/utils/localizeFilter";
export default {
  props: ["isSidebar"],
  data: () => ({
    links: [
      { title: localizeFilter("Menu_Bill"), url: "/", exact: true },
      { title: localizeFilter("Menu_History"), url: "/history" },
      { title: localizeFilter("Menu_Planning"), url: "/planning" },
      { title: localizeFilter("Menu_NewRecord"), url: "/record" },
      { title: localizeFilter("Menu_Categories"), url: "/categories" },
    ],
  }),
};
</script>
