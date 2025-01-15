<template>
  <div class="settings">
    <settings-component></settings-component>
  </div>
</template>

<script>
// @ is an alias to /src
import SettingsComponent from '@/components/settings/SettingsComponent.vue'

export default {
  name: 'Settings',
  components: {
    SettingsComponent
  }
}
</script>
