<template>
  <div class="notFound">
		<not-found-component></not-found-component>
  </div>
</template>

<script>
// @ is an alias to /src
import NotFoundComponent from '@/components/layout/NotFoundComponent.vue'

export default {
  name: 'NotFound',
	components: {
		NotFoundComponent
	}
}
</script>
