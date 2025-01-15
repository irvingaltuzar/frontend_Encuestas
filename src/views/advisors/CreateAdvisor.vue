<template>
	<div class="create-advisor">
		<create-advisor-component></create-advisor-component>
		<advisor-list-component></advisor-list-component>
	</div>
</template>

<script>
// @ is an alias to /src
import CreateAdvisorComponent from '@/components/advisors/CreateAdvisorComponent.vue'
import AdvisorListComponent from '@/components/advisors/AdvisorListComponent.vue'

export default {
	name: 'CreateAdvisor',
	components: {
	CreateAdvisorComponent,
	AdvisorListComponent
	}
}
</script>
