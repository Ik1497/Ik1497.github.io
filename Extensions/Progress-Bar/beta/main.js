window.$progressConfig = {
  actionsOnLoad: [],
  exclude: [],
  include: [],
  integrations: {
    twitch: {
      cheers: {
        enabled: false,
        config: {
          id: `cheersgoal`,
          title: `Cheers Goal`,
          maximum: `2000`,
          minimum: `0`,
          startValue: `0`
        },
        events: [
          {
            eventSource: `Twitch`,
            eventType: `Cheer`,
            value: `message.bits`
          }
        ]
      },
      followers: {
        enabled: false,
        config: {
          id: `followgoal`,
          title: `Followers Goal`,
          maximum: `200`,
          minimum: `0`,
          startValue: `0`
        },
        events: [
          {
            eventSource: `Twitch`,
            eventType: `Follow`,
            value: 1
          }
        ]
      },
      subscribers: {
        enabled: false,
        config: {
          id: `subgoal`,
          title: `Sub Goal`,
          maximum: `20`,
          minimum: `0`,
          startValue: `0`
        },
        events: [
          {
            eventSource: `Twitch`,
            eventType: `Sub`,
            value: 1
          },
          {
            eventSource: `Twitch`,
            eventType: `ReSub`,
            value: 1
          },
          {
            eventSource: `Twitch`,
            eventType: `GiftSub`,
            value: 1
          },
          {
            eventSource: `Twitch`,
            eventType: `GiftBomb`,
            value: `gifts`
          }
        ]
      },
      'channel-goal': {
        enabled: false,
        config: {
          id: `twitchchannelgoal`,
          title: `Twitch Channel Goal`,
          maximum: `100`,
          minimum: `0`,
          startValue: `0`
        },
        events: [
          {
            eventSource: `Twitch`,
            eventType: `GoalProgress`,
            value: `goal.currentAmount`,
            type: `set`
          }
        ]
      },
      'charity-goal': {
        enabled: false,
        config: {
          id: `twitchcharitygoal`,
          title: `Twitch Charity Goal`,
          maximum: `100`,
          minimum: `0`,
          startValue: `0`
        },
        events: [
          {
            eventSource: `Twitch`,
            eventType: `CharityDonation`,
            value: `charity.amount.value`
          }
        ]
      }
    },
    youtube: {
      superchat: {
        enabled: false,
        config: {
          id: `youtubesuperchat`,
          title: `Super Chat Goal`,
          maximum: `100`,
          minimum: `0`,
          startValue: `0`
        },
        events: [
          {
            eventSource: `YouTube`,
            eventType: `SuperChat`,
            value: `amount`
          }
        ]
      }
    },
    kofi: {
      donations: {
        enabled: false,
        config: {
          id: `kofidonations`,
          title: `Ko-fi Donation Goal`,
          maximum: `100`,
          minimum: `0`,
          startValue: `0`
        },
        events: [
          {
            eventSource: `Kofi`,
            eventType: `Donation`,
            value: `amount`
          }
        ]
      }
    },
    donordrive: {
      donations: {
        enabled: false,
        config: {
          id: `donordrivedonations`,
          title: `DonorDrive Donations Goal`,
          maximum: `100`,
          minimum: `0`,
          startValue: `0`
        },
        events: [
          {
            eventSource: `DonorDrive`,
            eventType: `Donation`,
            value: `donorAmount`
          }
        ]
      }
    },
    streamelements: {
      tips: {
        enabled: false,
        config: {
          id: `streamelementstips`,
          title: `StreamElements Tip Goal`,
          maximum: `100`,
          minimum: `0`,
          startValue: `0`
        },
        events: [
          {
            eventSource: `StreamElements`,
            eventType: `Tip`,
            value: `tipAmount`
          }
        ]
      }
    },
    streamlabs: {
      donations: {
        enabled: false,
        config: {
          id: `streamlabsdonations`,
          title: `Streamlabs Donations Goal`,
          maximum: `100`,
          minimum: `0`,
          startValue: `0`
        },
        events: [
          {
            eventSource: `Streamlabs`,
            eventType: `Donation`,
            value: `donationAmount`
          }
        ]
      }
    },
    tipeeestream: {
      donations: {
        enabled: false,
        config: {
          id: `tipeeestreamdonations`,
          title: `TipeeeStream Donations Goal`,
          maximum: `100`,
          minimum: `0`,
          startValue: `0`
        },
        events: [
          {
            eventSource: `TipeeeStream`,
            eventType: `Donation`,
            value: `amount`
          }
        ]
      }
    }
  }
};

[...new URLSearchParams(location.search)].forEach(param => {
  const name = param[0]
  const value = param[1]

  if (value === undefined || value === null) return

  switch (name) {
    case `progress-action-on-load`:
      try {
        JSON.parse(value)
      } catch {
        return
      }

      window.$progressConfig.actionsOnLoad = JSON.parse(value)
      break
    case `include`:
      try {
        JSON.parse(value)
      } catch {
        return
      }

      if (!Array.isArray(JSON.parse(value))) return

      window.$progressConfig.include = JSON.parse(value)
      break
    case `exclude`:
      try {
        JSON.parse(value)
      } catch {
        return
      }

      if (!Array.isArray(JSON.parse(value))) return

      window.$progressConfig.exclude = JSON.parse(value)
      break
  }

  Object.entries($progressConfig.integrations).forEach(entry => {
    let integration = entry[0]
  
    Object.entries(entry[1]).forEach(integrationType => {
      let type = integrationType[0]
  
      if (name === `${integration}-${type}`) {
        integrationType[1].enabled = true
      }
    });
  });
})

function useParam(param, existCallback = () => {}, notExistCallback = () => {}, defaultValue) {
  let paramValue = new URLSearchParams(location.search).get(param)

  if (paramExist(param)) {
    existCallback()
  } else {
    notExistCallback()

    paramValue = defaultValue
  }

  return paramValue
}

function paramExist(param) {
  let paramValue = new URLSearchParams(location.search).get(param)

  if (paramValue != null && paramValue != undefined) {
    return true
  } else {
    return false
  }
}

document.body.insertAdjacentHTML(`afterbegin`, `
<ul class="progress-bar-list"></ul>
`)

const theme = new URLSearchParams(window.location.search).get(`theme`) || `default`

let cycleDuration = new URLSearchParams(window.location.search).get(`cycle-duration`) || 15000
let cycleTransitionDuration = new URLSearchParams(window.location.search).get(`cycle-transition-duration`) || 500

//////////////////////
/// Websocket Code ///
//////////////////////
connectws();

function connectws() {
  if ("WebSocket" in window) {
    let wsServerUrl = new URLSearchParams(window.location.search).get("ws") || "ws://localhost:8080/";
    const ws = new WebSocket(wsServerUrl);
    console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Trying to connect to Streamer.bot...");

    ws.onclose = function () {
      setTimeout(connectws, 10000);
      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "No connection found to Streamer.bot, reconnecting every 10s...");
    }

    ws.onopen = function () {
      ws.send(
        JSON.stringify({
          request: `Subscribe`,
          events: {
            general: [`Custom`],
            twitch: [`Cheer`, `Follow`, `Sub`, `ReSub`, `GiftSub`, `GiftBomb`, `GoalProgress`, `CharityDonation`],
            youTube: [`SuperChat`],
            kofi: [`Donation`],
            tipeeeStream: [`Donation`],
            streamElements: [`Tip`],
            streamlabs: [`Donation`],
            donorDrive: [`Donation`],
          },
          id: `123`,
        })
      )

      console.log("[" + new Date().getHours() + ":" +  new Date().getMinutes() + ":" +  new Date().getSeconds() + "] " + "Connected to Streamer.bot");

      $progressConfig.actionsOnLoad.forEach(action => {
        ws.send(
          JSON.stringify({
            request: "DoAction",
            action: {
              name: action
            },
            id: "123",
          })
        )
      });

      function progressConfigDefaultCreateArgs(name) {
        return {
          progressBackgroundColor: useParam(`${name}-progress-background-color`, undefined, undefined, undefined),
          progressBarColor: useParam(`${name}-progress-background-color`, undefined, undefined, undefined),
          prependIcon: useParam(`${name}-prepend-icon`, undefined, undefined, undefined),
          appendIcon: useParam(`${name}-append-icon`, undefined, undefined, undefined),
          actionOnFinish: useParam(`${name}-action-on-finish`, undefined, undefined, undefined),
          actionOnRemove: useParam(`${name}-action-on-remove`, undefined, undefined, undefined),
          actionOnUpdate: useParam(`${name}-action-on-update`, undefined, undefined, undefined),
          actionOnProgress: useParam(`${name}-action-on-progress`, undefined, undefined, undefined)
        }
      }

      Object.entries($progressConfig.integrations).forEach(entry => {
        let integration = entry[0]

        Object.entries(entry[1]).forEach(integrationType => {
          let type = integrationType[0]
          let typeConfig = integrationType[1]
          let typeOptions = integrationType[1].config

          if (typeConfig.enabled) {
            typeOptions.id = useParam(`${integration}-${type}-id`, undefined, undefined, typeOptions.id),
            typeOptions.title = useParam(`${integration}-${type}-title`, undefined, undefined, typeOptions.title),
            typeOptions.maximum = useParam(`${integration}-${type}-maximum`, undefined, undefined, typeOptions.maximum),
            typeOptions.minimum = useParam(`${integration}-${type}-minimum`, undefined, undefined, typeOptions.minimum),
            typeOptions.startValue = useParam(`${integration}-${type}-start-value`, undefined, undefined, typeOptions.startValue),

            create(
              typeOptions.id,
              typeOptions.title,
              typeOptions.maximum,
              typeOptions.minimum,
              typeOptions.startValue,
              progressConfigDefaultCreateArgs(`${integration}-${type}`)
            )
          }
        });
      });
    }

    ws.addEventListener("message", (event) => {
      if (!event.data) return;
      const data = JSON.parse(event.data);

      console.log(data)

      if (data?.event) {

        Object.entries($progressConfig.integrations).forEach(entry => {
          let integration = entry[0]
  
          Object.entries(entry[1]).forEach(integrationType => {
            let type = integrationType[0]
            let typeConfig = integrationType[1]
            let typeOptions = integrationType[1].config
            let typeEvents = integrationType[1].events
  
            typeEvents.forEach(typeEvent => {
              if (data.event.source != typeEvent.eventSource) return
              if (data.event.type != typeEvent.eventType) return

              let amount = typeEvent.value
              if (typeof amount === `string`) {
                let amountSplit = amount.split(`.`)
                amount = data.data
                amountSplit.forEach(amountSplitItem => {
                  if (amount != undefined && amount != null) amount = amount[amountSplitItem]
                });
              }

              if (amount === undefined || amount === null) amount = 0

              if (typeEvent?.type === `set`) {
                update(typeOptions.id, {value: amount})
              } else {
                progress(typeOptions.id, amount)
              }
            });
          });
        });
      }
      
      if (data?.data?.widget != `progress-bar`) return
      if (data?.data?.args?.id === undefined) return
      
      if (data?.data?.args?.startValue >= data?.data?.args?.maximum) {
        createSnackbar(`Cannot create progress bar because the start value is bigger then the maximum`, `error`)
        
      } else if (data?.data?.args?.request === `create`) {
        if (data?.data?.args?.title === undefined) return
        if (data?.data?.args?.maximum === undefined) return
        if (data?.data?.args?.minimum === undefined) return
        if (data?.data?.args?.startValue === undefined) return
        if (isNaN(data?.data?.args?.maximum) || data?.data?.args?.maximum === "NaN") return
        if (isNaN(data?.data?.args?.minimum) || data?.data?.args?.minimum === "NaN") return
        if (isNaN(data?.data?.args?.startValue) || data?.data?.args?.startValue === "NaN") return
        
        create(data?.data?.args?.id, data?.data?.args?.title, data?.data?.args?.maximum, data?.data?.args?.minimum, data?.data?.args?.startValue, data?.data?.args)
      }
      
      else if (data?.data?.args?.request === `progress`) {
        if (data?.data?.args?.value === undefined) return
        if (isNaN(data?.data?.args?.value) || data?.data?.args?.value === "NaN") return

        progress(data?.data?.args?.id, data?.data?.args?.value, data?.data?.args)
      }

      else if (data?.data?.args?.request === `update`) {
        if (data?.data?.args === undefined) return

        update(data?.data?.args?.id, data?.data?.args)
      }
      
      else if (data?.data?.args?.request === `remove`) {
        remove(data?.data?.args?.id, data?.data?.args)
      }
    })

    function create(id, title = `Progress Bar`, maximum = 50, minimum = 0, startValue = 0, args) {
      if ($progressConfig.exclude.includes(id)) return
      if (JSON.stringify($progressConfig.include) != `[]` && !$progressConfig.include.includes(id)) return

      let progressContainer = document.createElement(`div`)
      progressContainer.className = `progress-container`

      let progressBarContainer = document.createElement(`div`)
      progressBarContainer.id = id
      progressBarContainer.className = `container`
      progressBarContainer.dataset.state = `hidden`

      if (theme === `default`) {
        progressBarContainer.innerHTML = `
        <p class="start-goal"></p>
        <div class="progress-bar"></div>
        <div class="goal-title-container">
          <p class="goal-title"></p>
        </div>
        <p class="end-goal"></p>
        <p class="progress-text">0%</p>
        `
      } else if (theme === `compact`) {
        progressBarContainer.innerHTML = `
        <div class="progress-bar"></div>
        <div class="ThemeMinimal__middle-container">
          <p class="ThemeMinimal__progress-text"></p>
          <p class="ThemeMinimal__goal-title"></p>
        </div>
        `
      }

      progressBarSetTitle(progressBarContainer, title, args)
      progressBarSetValue(progressBarContainer, startValue, args)
      progressBarSetMaximum(progressBarContainer, maximum, args)
      progressBarSetMinimum(progressBarContainer, minimum, args)
      progressBarSetStartValue(progressBarContainer, startValue, args)

      document.querySelector(`ul.progress-bar-list`).prepend(progressContainer)
      progressContainer.prepend(progressBarContainer)
      
      if (args.progressBackgroundColor != null && args.progressBackgroundColor != undefined) {
        progressBarContainer.style.setProperty(`--background`, args.progressBackgroundColor)
      }
      
      if (args.prependIcon != null && args.prependIcon != undefined) {
        if (!args.prependIcon.includes(`mdi mdi-`)) {
          let image = document.createElement(`img`)
          progressContainer.prepend(image)
          image.className = `prepend-icon`
          image.alt = `Prepend Icon`
          image.src = args.prependIcon
          image.style.setProperty(`--size`, `${progressBarContainer.clientHeight}px`)
        }
      }
      
      if (args.appendIcon != null && args.appendIcon != undefined) {
        if (!args.appendIcon.includes(`mdi mdi-`)) {
          let image = document.createElement(`img`)
          progressContainer.append(image)
          image.className = `append-icon`
          image.alt = `Append Icon`
          image.src = args.appendIcon
          image.style.setProperty(`--size`, `${progressBarContainer.clientHeight}px`)
        }
      }

      if (args.actionOnFinish != null && args.actionOnFinish != undefined) {
        progressBarContainer.dataset.actionOnFinish = args.actionOnFinish
      } if (args.actionOnRemove != null && args.actionOnRemove != undefined) {
        progressBarContainer.dataset.actionOnRemove = args.actionOnRemove
      } if (args.actionOnUpdate != null && args.actionOnUpdate != undefined) {
        progressBarContainer.dataset.actionOnUpdate = args.actionOnUpdate
      } if (args.actionOnProgress != null && args.actionOnProgress != undefined) {
        progressBarContainer.dataset.actionOnProgress = args.actionOnProgress
      }

      if (args.progressBarColor != null && args.progressBarColor != undefined) {
        progressBarContainer.style.setProperty(`--background-progress-bar`, args.progressBarColor)
      }

      updateCycle()
    }
    
    function progress(id, value = `50`, args) {
      document.querySelectorAll(`#${id}`).forEach(container => {
        progressBarSetRelativeValue(container, value, args)

        if (container.dataset?.actionOnProgress != undefined && container.dataset?.actionOnProgress != null) {
          RunAction(container.dataset?.actionOnProgress, args)
        }
      });
    }

    function set(id, value = `0`, args) {
      document.querySelectorAll(`#${id}`).forEach(container => {
        progressBarSetValue(container, value, args)
      });
    }


    function update(id, args) {
      if (args.value != undefined) {
        set(id, args.value, args)
      }
      
      if (args.progressBarBackgroundColor != undefined) {
        document.querySelectorAll(`#${id}`).forEach(container => {
          container.style.setProperty(`--background`, args.progressBarBackgroundColor)
        })
      }

      if (args.progressBarColor != undefined) {
        document.querySelectorAll(`#${id}`).forEach(container => {
          container.style.setProperty(`--background-progress-bar`, args.progressBarColor)
        })
      }

      if (args.progressBarTitle != undefined) {
        document.querySelectorAll(`#${id}`).forEach(container => {
          progressBarSetTitle(container, args.progressBarTitle, args)
        })
      }

      if (args.progressBarMaximum != undefined) {
        document.querySelectorAll(`#${id}`).forEach(container => {
          progressBarSetMaximum(container, args.progressBarMaximum, args)
        })
      }

      document.querySelectorAll(`#${id}`).forEach(container => {
        if (container.dataset?.actionOnUpdate != undefined && container.dataset?.actionOnUpdate != null) {
          RunAction(container.dataset?.actionOnUpdate, args)
        }
      })

      document.querySelectorAll(`#${id}`).forEach(progressBarContainer => {
        if (args.actionOnFinish != null && args.actionOnFinish != undefined) {
          progressBarContainer.dataset.actionOnFinish = args.actionOnFinish
        } if (args.actionOnRemove != null && args.actionOnRemove != undefined) {
          progressBarContainer.dataset.actionOnRemove = args.actionOnRemove
        } if (args.actionOnUpdate != null && args.actionOnUpdate != undefined) {
          progressBarContainer.dataset.actionOnUpdate = args.actionOnUpdate
        } if (args.actionOnProgress != null && args.actionOnProgress != undefined) {
          progressBarContainer.dataset.actionOnProgress = args.actionOnProgress
        }
      })
    }
    
    function remove(id, args) {        
      document.querySelectorAll(`#${id}`).forEach(container => {
        container.parentNode.classList.add(`removing`)
        
        container.parentNode.addEventListener(`animationend`, () => {
          container.parentNode.remove();

          updateCycle()
        });

        if (container.dataset?.actionOnRemove != undefined && container.dataset?.actionOnRemove != null) {
          RunAction(container.dataset?.actionOnRemove, args)
        }
      });
    }
    
    function finish(id, args) {
      document.querySelectorAll(`#${id}`).forEach(container => {
        let title = container.dataset.title
      
        container.insertAdjacentHTML(`beforeend`, `<marquee class="goal-finished" scrollamount="10">${title} Finished!!!</marquee>`);
      
        setTimeout(() => {
          remove(id, args)
        }, 7500);

        if (container.dataset?.actionOnFinish != undefined && container.dataset?.actionOnFinish != null) {
          RunAction(container.dataset?.actionOnFinish, args)
        }
      });
    }

    function RunAction(name, args = {}) {
      ws.send(
        JSON.stringify({
          request: "DoAction",
          action: {
            name: name
          },
          args: args,
          id: "RunAction",
        })
      );
    }

    function progressBarSetTitle(element, title, args) {
      element.dataset.title = title
    
      if (theme === `default`) {
        element.querySelector(`.goal-title`).innerText = title
      } else if (theme === `compact`) {
        element.querySelector(`.ThemeMinimal__goal-title`).innerText = title
      }
    }
    
    function progressBarSetValue(element, value, args) {
      element.dataset.currentValue = value
      let maximum = element.dataset.maximum
    
      if (theme === `default`) {
        element.dataset.currentValue = Number(value)
        element.querySelector(".start-goal").innerText = `${Math.round(Number(value))}`
        element.querySelector(".progress-bar").style.width = `${Number(value) / Number(maximum) * 100}%`
      } else if (theme === `compact`) {
        element.dataset.currentValue = Number(value)
        element.querySelector(".ThemeMinimal__progress-text").innerText = `${Math.round(Number(value))} / ${Math.round(Number(element.dataset.maximum))}`
        element.querySelector(".progress-bar").style.width = `${Number(value) / Number(maximum) * 100}%`
      }
    
      if (Number(value) >= Number(maximum)) {
        finish(element.id, args)
      }
    }
    
    function progressBarSetRelativeValue(element, value, args) {
      progressBarSetValue(element, Number(element.dataset.currentValue) + Number(value), args)
    }

    function progressBarSetMaximum(element, maximum, args) {
      element.dataset.maximum = maximum

      if (theme === `default`) {
        element.querySelector(`.end-goal`).innerText = maximum
      }

      progressBarSetValue(element, element.dataset.currentValue, args)
    }

    function progressBarSetMinimum(element, minimum, args) {
      element.dataset.minimum = minimum
    }
    
    function progressBarSetStartValue(element, startValue, args) {
      element.dataset.startValue = startValue

      progressBarSetValue(element, startValue, args)
    }
  }
}

function updateCycle() {
  if (new URLSearchParams(window.location.search).get(`cycle`) != null) {
    document.body.setAttribute(`progress-bar-count`, document.querySelectorAll(`.progress-bar-list .container`).length)
    if (document.body.getAttribute(`current-progress-bar`) === null) {
      document.body.setAttribute(`current-progress-bar`, 0)
    }
  }
}

setInterval(() => {
  if (document.body.getAttribute(`current-progress-bar`) != null && document.body.getAttribute(`progress-bar-count`) != null) {
    let currentProgressBar = Number(document.body.getAttribute(`current-progress-bar`))

    if (Number(document.body.getAttribute(`current-progress-bar`)) < Number(document.body.getAttribute(`progress-bar-count`))) {
      document.body.setAttribute(`current-progress-bar`, Number(document.body.getAttribute(`current-progress-bar`)) + 1)
      currentProgressBar += 1
    } else {
      document.body.setAttribute(`current-progress-bar`, 1)
      currentProgressBar = 1
    }

    document.querySelectorAll(`.progress-bar-list .container`).forEach(container => {
      if (container.dataset.state === `shown` || container.dataset.state === `showing`) {
        container.setAttribute(`data-state`, `hiding`)
      }

      setTimeout(() => {
        if (container.dataset.state === `hiding`) {
          container.setAttribute(`data-state`, `hidden`)
        }
      }, cycleTransitionDuration);
    });
    Array.from(document.querySelectorAll(`.progress-bar-list .container`)).reverse()[currentProgressBar - 1].setAttribute(`data-state`, `showing`)
    
    setTimeout(() => {
      if (Array.from(document.querySelectorAll(`.progress-bar-list .container`)).reverse()[currentProgressBar - 1].dataset.state === `showing`) {
        Array.from(document.querySelectorAll(`.progress-bar-list .container`)).reverse()[currentProgressBar - 1].dataset.state = `shown`
      }
    }, cycleTransitionDuration);
  }
}, cycleDuration);

//////////////////////
/// URL parameters ///
//////////////////////
// General
const params = new URLSearchParams(window.location.search)
const root = document.querySelector(":root")

// Misc
params.get(`theme`) != null ? document.body.dataset.theme = params.get(`theme`) : document.body.dataset.theme = `default`
params.get(`position`) != null ? document.body.dataset.position = params.get(`position`) : document.body.dataset.position = `top-left`
params.get(`nowrap`) != null ? document.body.classList.add(`nowrap`) : ``
params.get(`row`) != null ? document.body.classList.add(`row`) : ``
params.get(`column`) != null ? document.body.classList.add(`column`) : ``

// Misc Styling
root.style.setProperty(`--custom-progress-bar-width`, params.get(`width`))

// Font
root.style.setProperty(`--font-family`, params.get(`font-family`))
root.style.setProperty(`--font-weight`, params.get(`font-weight`))
root.style.setProperty(`--font-style`, params.get(`font-style`))
root.style.setProperty(`--font-size`, params.get(`font-size`))
root.style.setProperty(`--font-color`, params.get(`font-color`))

// Background
root.style.setProperty(`--background`, params.get(`background`))
root.style.setProperty(`--background-progress-bar`, params.get(`background-progress-bar`))
root.style.setProperty(`--background-border-radius`, params.get(`background-border-radius`))

// Animations
root.style.setProperty(`--animation-duration`, params.get(`animation-duration`))
root.style.setProperty(`--transition-duration`, params.get(`transition-duration`))

// Cycle
root.style.setProperty(`--cycle-transition-duration`, `${cycleTransitionDuration}ms`)
root.style.setProperty(`--cycle-duration`, `${cycleDuration}ms`)

if (params.get(`cycle`) != null) {
  if (params.get(`cycle-transition`) != null) {
    document.body.dataset.cycleTransition = params.get(`cycle-transition`)
  } else {
    document.body.dataset.cycleTransition = `fade`
  }
}
