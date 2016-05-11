;(function () {
  $.getJSON('/db.json', function (database) {
    var days = getLastDays(7)

    var data = {
      labels: [],
      labelsIndex: [],
      datasets: [{
        label: 'MaxScale',
        data: []
      }]
    }

    var ecartement = 0
    $.each(database, function (key, value) {
      var color = '#' + getColor(value.name)
      var dset = {
        label: value.name,
        backgroundColor: 'rgba(220,220,220,0)',
        borderColor: color,
        pointRadius: 3,
        pointBackgroundColor: color,
        lineTension: 0,
        fill: false,
        data: []
      }

      $.each(value.ip, function (key, ip) {
        // ip = ip.slice(ip.length - 20, ip.length)
        $.each(ip, function (key, timestap) {
          var index = data.labelsIndex.indexOf(timestap)
          if (index === -1) {
            data.labels.push(formatDate(timestap))
            data.labels.sort()
            data.labelsIndex.push(timestap)
            data.labelsIndex.sort()
            index = data.labelsIndex.indexOf(timestap)
          }
          dset.data[index] = 1 + ecartement
        })
      })

      data.datasets.push(dset)
      ecartement += 3
    })


    var ctx = $('#chart')

    var myBarChart = new Chart(ctx, {
      type: 'line',
      data: data
    })

    var range = $('#range')
    range.attr('max', data.labels.length)

    range.on('change', function(){
      var value = $(this).val()

      var newData = $.extend({}, data)
      newData.labels = newData.labels.slice(newData.labels.length - value)

      myBarChart.destroy()
      myBarChart = new Chart(ctx, {
        type: 'line',
        data: newData
      })
      console.log(data.labels)
    })


  })

  function getLastDays (nb) {
    var dates = []
    for (var i = nb - 1; i >= 0; --i) {
      var d = new Date()
      d.setDate(d.getDate() - i)
      d.setHours(0)
      d.setMinutes(0)
      d.setSeconds(0)
      d.setMilliseconds(0)
      dates.push(d)
    }
    return dates
  }

  function formatDate (date) {
    var date = new Date(date)
    var day = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.']
    var hours = date.getHours().toString()
    hours = hours.length < 2 ? '0' + hours : hours
    var minutes = date.getMinutes().toString()
    minutes = minutes.length < 2 ? '0' + minutes : minutes
    return day[date.getDay()] + ' ' + hours + 'h' + minutes
  }

  String.prototype.hashCode = function () {
    var hash = 0, i, chr, len
    if (this.length === 0) return hash
    for (i = this.length/5, len = this.length; i < len; i++) {
      chr = this.charCodeAt(i)
      hash = ((hash << 5) - hash) + chr
      hash |= 0 // Convert to 32bit integer
    }
    return hash
  }

  function intToRGB (i) {
    var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase()

    return '00000'.substring(0, 6 - c.length) + c
  }

  function getColor (string) {
    return intToRGB(string.hashCode())
  }
})()
