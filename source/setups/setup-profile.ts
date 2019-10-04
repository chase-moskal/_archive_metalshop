
import {ProfilerTopic} from "authoritarian/dist/interfaces.js"
import {createProfilerCacheCrosscallClient} from "authoritarian/dist/clients.js"

import {select} from "../toolbox/selects.js"
import {ProfileModel} from "../models/profile-model.js"

export async function setupProfile({config, eventTarget, profiler}: {
	config: Element
	eventTarget: EventTarget
	profiler?: ProfilerTopic
}) {
	const profileModelConfig = select("profile-model", config)
	if (!profileModelConfig) return
	const profilerUrl = profileModelConfig.getAttribute("url")
	profiler = profiler || await createProfilerCacheCrosscallClient({
		url: `${profilerUrl}/html/profiler-cache`
	})
	return new ProfileModel({profiler, eventTarget})
}
